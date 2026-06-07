import { MARKETING, TSA_BADGES } from '@/content/legalCopy';
import api from '@/lib/api';

export async function downloadCounselPacket(stampId) {
  try {
    const res = await api.get(`/legal/${stampId}/litigation-pack`, {
      responseType: 'blob'
    });
    const blob = new Blob([res.data]);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${stampId}-counsel-evidence-packet.zip`;
    a.click();
    URL.revokeObjectURL(a.href);
  } catch (err) {
    let msg = 'Download failed';
    if (err.response?.data instanceof Blob) {
      try {
        const text = await err.response.data.text();
        const json = JSON.parse(text);
        msg = json.error || json.message || msg;
      } catch (e) {}
    } else if (err.response?.data) {
      msg = err.response.data.error || err.response.data.message || msg;
    }
    throw new Error(msg);
  }
}

/** @deprecated use downloadCounselPacket */
export const downloadLitigationPack = downloadCounselPacket;

export async function attestCreator(stampId, { fullName, city, country }) {
  try {
    const res = await api.post(`/legal/${stampId}/attest`, {
      fullName,
      city,
      country,
      confirm: true,
      statementConfirm: true,
      statementVersion: '2.0',
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.response?.data?.message || 'Attestation failed');
  }
}

export function legalStatusBadges(stamp) {
  const badges = [];
  const tier = stamp.tsaTier || 'development';
  const tsaPending = stamp.tsaStatus === 'pending' || (!stamp.tsaToken && stamp.tsaVerifyStatus !== 'valid');
  badges.push({
    label: tsaPending
      ? 'Timestamp pending — retrying within 1 hour'
      : TSA_BADGES[tier] || TSA_BADGES.development,
    variant: stamp.tsaVerifyStatus === 'valid' && !tsaPending ? 'success' : 'secondary',
  });
  if (stamp.evidenceCertificateUrl) {
    badges.push({ label: 'BSA s.63 cert', variant: 'success' });
  }
  if (stamp.creatorAttestationAt) {
    badges.push({ label: 'Creator attested', variant: 'success' });
  }
  return badges;
}

export { MARKETING };
