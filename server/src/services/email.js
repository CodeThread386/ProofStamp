const axios = require('axios');

function isSmtpConfigured() {
  return Boolean(process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN);
}

async function refreshAccessToken() {
  const response = await axios.post('https://oauth2.googleapis.com/token', {
    client_id: process.env.GMAIL_CLIENT_ID,
    client_secret: process.env.GMAIL_CLIENT_SECRET,
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  });
  return response.data.access_token;
}

function makeBase64UrlEmail(to, from, subject, html) {
  const messageParts = [
    `From: ProofStamp <${from}>`,
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    html,
  ];
  const message = messageParts.join('\n');
  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function sendVerificationCode(email, code, purpose = 'signup') {
  const subject =
    purpose === 'login'
      ? 'Your ProofStamp login code'
      : 'Verify your email for ProofStamp';

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">ProofStamp</h2>
      <p>Your verification code is:</p>
      <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111;">${code}</p>
      <p style="color: #666; font-size: 14px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
    </div>
  `;

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!isSmtpConfigured()) {
    console.log(`[Email] Gmail API not configured — code for ${email}: ${code}`);
    return { devMode: true };
  }

  try {
    const accessToken = await refreshAccessToken();
    const rawMessage = makeBase64UrlEmail(email, from, subject, html);

    await axios.post(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      { raw: rawMessage },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    const errorMsg = err.response?.data?.error?.message || err.message;
    console.error(`[Email Error] Failed to send to ${email}:`, errorMsg);
    return { devMode: true, error: errorMsg, code };
  }

  return { sent: true };
}

module.exports = { sendVerificationCode, isSmtpConfigured };
