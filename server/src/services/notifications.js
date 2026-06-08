const nodemailer = require('nodemailer');
const prisma = require('../config/prisma');

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || 'alerts@proofstamp.io';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

function getTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

async function sendViaResend({ to, subject, text, html }) {
  if (!RESEND_API_KEY) return { sent: false, reason: 'resend_not_configured' };
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: SMTP_FROM,
      to: [to],
      subject,
      text,
      html,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend failed: ${res.status} ${body}`);
  }
  return { sent: true, provider: 'resend' };
}

async function createInAppNotification({ userId, type, title, body, link }) {
  if (!userId) return null;
  return prisma.userNotification.create({
    data: { userId, type, title, body: body || null, link: link || null },
  });
}

/**
 * Send an email via SMTP, falling back to Resend.
 * Returns { sent: false, reason } when there's no recipient or no provider
 * configured, but PROPAGATES errors thrown by the provider call itself —
 * wrap calls in try/catch (or .catch) if you need fire-and-forget safety.
 */
async function sendEmail({ to, subject, text, html }) {
  if (!to) return { sent: false, reason: 'no_recipient' };

  const transporter = getTransporter();
  if (transporter) {
    await transporter.sendMail({
      from: `"ProofStamp Alerts" <${SMTP_FROM}>`,
      to,
      subject,
      text,
      html,
    });
    return { sent: true, provider: 'smtp' };
  }

  if (RESEND_API_KEY) {
    await sendViaResend({ to, subject, text, html });
    return { sent: true, provider: 'resend' };
  }

  console.warn('[Notifications] Email not configured — skipping email send');
  return { sent: false, reason: 'email_not_configured' };
}

/**
 * Email creator when a new theft monitor alert is created.
 */
async function sendMonitorAlertEmail({ userId, userEmail, displayName, stamp, alert }) {
  const takedownUrl = `${CLIENT_URL}/takedowns?stampId=${stamp.id}&url=${encodeURIComponent(alert.sourceUrl)}&alertId=${alert.id}`;
  const dashboardUrl = `${CLIENT_URL}/dashboard`;
  const monitorUrl = `${CLIENT_URL}/monitor`;

  const sourceLabel =
    alert.sourceEngine === 'tineye' || alert.sourceEngine === 'google_vision'
      ? 'Found on the web'
      : 'Similar work on ProofStamp';

  await createInAppNotification({
    userId,
    type: 'MONITOR_ALERT',
    title: `Possible theft: ${stamp.title}`,
    body: `${sourceLabel} — ${alert.matchType} (${(alert.confidence * 100).toFixed(0)}%)`,
    link: takedownUrl,
  });

  const subject = `[ProofStamp] Possible theft detected — ${stamp.title}`;
  const text = `Hi ${displayName || 'creator'},

We found a possible unauthorized use of your work "${stamp.title}" (Stamp ${stamp.id}).

Source: ${alert.sourceUrl}
Type: ${sourceLabel}
Match type: ${alert.matchType}
Confidence: ${(alert.confidence * 100).toFixed(0)}%

File a takedown with your legal proof attached:
${takedownUrl}

View dashboard: ${dashboardUrl}
Monitor: ${monitorUrl}

— ProofStamp`;

  const html = `
    <p>Hi ${displayName || 'creator'},</p>
    <p>Possible unauthorized use of <strong>${stamp.title}</strong> (${stamp.id}):</p>
    <p><strong>${sourceLabel}</strong></p>
    <p><a href="${alert.sourceUrl}">${alert.sourceUrl}</a></p>
    <p>Match: ${alert.matchType} · Confidence: ${(alert.confidence * 100).toFixed(0)}%</p>
    <p><a href="${takedownUrl}">File DMCA takedown with proof</a> · <a href="${dashboardUrl}">Dashboard</a></p>
  `;

  const result = await sendEmail({ to: userEmail, subject, text, html });
  return { ...result, inApp: true };
}

/**
 * Notify the original creator when someone tries to re-register their work
 * and gets blocked as a duplicate. Loads the owner server-side so the
 * uploader never sees the owner's email. Safe to call fire-and-forget.
 */
async function notifyDuplicateAttempt(existingStampId, { attemptedByUsername, attemptedByUserId } = {}) {
  try {
    if (!existingStampId) return { sent: false, reason: 'no_stamp' };

    const stamp = await prisma.stamp.findUnique({
      where: { id: existingStampId },
      select: {
        id: true,
        title: true,
        passport: {
          select: {
            displayName: true,
            user: { select: { id: true, email: true } },
          },
        },
      },
    });

    const owner = stamp?.passport?.user;
    if (!owner?.id) return { sent: false, reason: 'no_owner' };

    // Skip self-collisions: a creator re-uploading their own work is not theft.
    if (attemptedByUserId && attemptedByUserId === owner.id) {
      return { sent: false, reason: 'self_upload' };
    }

    const displayName = stamp.passport.displayName;
    const monitorUrl = `${CLIENT_URL}/monitor`;
    const verifyUrl = `${CLIENT_URL}/verify?id=${stamp.id}`;
    const byLabel = attemptedByUsername ? `@${attemptedByUsername}` : 'Another user';

    await createInAppNotification({
      userId: owner.id,
      type: 'DUPLICATE_ATTEMPT',
      title: `Someone tried to re-register "${stamp.title}"`,
      body: `${byLabel} attempted to register your work and was blocked as a duplicate.`,
      link: monitorUrl,
    });

    const subject = `[ProofStamp] Someone tried to re-register your work — ${stamp.title}`;
    const text = `Hi ${displayName || 'creator'},

${byLabel} just attempted to register your work "${stamp.title}" (Stamp ${stamp.id}) on ProofStamp and was blocked because the content is already registered to you.

This can be an early signal of attempted theft. Review your work and monitoring:
${verifyUrl}
${monitorUrl}

— ProofStamp`;

    const html = `
      <p>Hi ${displayName || 'creator'},</p>
      <p><strong>${byLabel}</strong> just attempted to register your work <strong>${stamp.title}</strong> (${stamp.id}) and was blocked as a duplicate.</p>
      <p>This can be an early signal of attempted theft.</p>
      <p><a href="${verifyUrl}">View your registration</a> · <a href="${monitorUrl}">Open monitoring</a></p>
    `;

    const result = await sendEmail({ to: owner.email, subject, text, html });
    return { ...result, inApp: true };
  } catch (err) {
    console.error('[Notifications] notifyDuplicateAttempt failed:', err.message);
    return { sent: false, reason: 'error' };
  }
}

/**
 * Notify a creator about a takedown that has been auto-escalated past its SLA
 * deadline (kind='escalated') or is approaching it (kind='approaching').
 * Expects `takedown` to include stamp {id,title} and passport {displayName, user {id,email}}.
 */
async function sendTakedownEscalationNotice({ takedown, kind }) {
  try {
    const owner = takedown?.passport?.user;
    if (!owner?.id) return { sent: false, reason: 'no_owner' };

    const displayName = takedown.passport.displayName;
    const takedownUrl = `${CLIENT_URL}/takedowns?stampId=${takedown.stampId}`;
    const deadline = takedown.responseDeadline
      ? new Date(takedown.responseDeadline).toUTCString()
      : 'unknown';
    const workTitle = takedown.stamp?.title || takedown.stampId;

    const escalated = kind === 'escalated';
    const title = escalated
      ? `Takedown escalated — no response from ${takedown.platform}`
      : `Takedown deadline approaching — ${takedown.platform}`;
    const bodyLine = escalated
      ? `${takedown.platform} did not respond by the SLA deadline. Consider escalating to the hosting provider/ISP or WIPO Arbitration.`
      : `${takedown.platform} has not yet responded; the SLA deadline is ${deadline}.`;

    await createInAppNotification({
      userId: owner.id,
      type: 'TAKEDOWN_ESCALATION',
      title,
      body: bodyLine,
      link: takedownUrl,
    });

    const subject = `[ProofStamp] ${title} — ${workTitle}`;
    const text = `Hi ${displayName || 'creator'},

${bodyLine}

Work: ${workTitle} (Stamp ${takedown.stampId})
Platform: ${takedown.platform}
Infringing URL: ${takedown.infringingUrl}
Response deadline: ${deadline}

Manage this takedown:
${takedownUrl}

— ProofStamp`;

    const html = `
      <p>Hi ${displayName || 'creator'},</p>
      <p>${bodyLine}</p>
      <p><strong>${workTitle}</strong> (${takedown.stampId}) · Platform: ${takedown.platform}</p>
      <p>Infringing URL: <a href="${takedown.infringingUrl}">${takedown.infringingUrl}</a></p>
      <p>Response deadline: ${deadline}</p>
      <p><a href="${takedownUrl}">Manage this takedown</a></p>
    `;

    const result = await sendEmail({ to: owner.email, subject, text, html });
    return { ...result, inApp: true };
  } catch (err) {
    console.error('[Notifications] sendTakedownEscalationNotice failed:', err.message);
    return { sent: false, reason: 'error' };
  }
}

module.exports = {
  sendMonitorAlertEmail,
  createInAppNotification,
  sendEmail,
  notifyDuplicateAttempt,
  sendTakedownEscalationNotice,
  getTransporter,
};
