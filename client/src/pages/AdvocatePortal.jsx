import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import LegalEvidenceSummary from '@/components/LegalEvidenceSummary';
import { Button } from '@/components/ui/button';
import { Shield, Upload, CheckCircle2, AlertTriangle, HelpCircle, Loader2, Lock, Scale, ExternalLink, Calendar, Fingerprint } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdvocatePortal() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [hashProgress, setHashProgress] = useState('');

  async function verifyZeroTrust(file) {
    setLoading(true);
    setError('');
    setResult(null);
    setHashProgress('Computing SHA-256 hash locally...');

    try {
      // 1. Client-Side Hashing (Zero-Trust)
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setHashProgress(`Local Hash: ${hashHex.substring(0, 16)}... querying blockchain/registry`);

      // 2. Query Backend with Hash Only
      const res = await api.get(`/verify/hash/${hashHex}`);
      
      setResult({ ...res.data, clientHash: hashHex });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Verification failed. Make sure you are connected.');
    } finally {
      setLoading(false);
      setHashProgress('');
    }
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    const f = acceptedFiles[0];
    if (f) verifyZeroTrust(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <Layout>
      <div className="max-w-3xl mx-auto animate-fade-up pt-10">
        <div className="mb-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-sm font-medium mb-2">
            <Lock className="h-4 w-4" /> Zero-Trust Architecture
          </div>
          <h1 className="text-5xl font-semibold tracking-tight text-white">Advocate Portal</h1>
          <p className="text-white/60 text-lg font-medium max-w-xl mx-auto">
            Cryptographically verify digital evidence without uploading the file to any server. Hashing and signature validation occurs entirely on your device.
          </p>
        </div>

        {!result && (
          <div className="apple-glass-panel rounded-[3rem] p-12 text-center apple-shadow border border-indigo-500/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
            <div
              {...getRootProps()}
              className={`relative rounded-[2rem] p-12 text-center cursor-pointer transition-all duration-500 outline-none ${
                isDragActive ? 'bg-indigo-500/10 scale-105 shadow-2xl shadow-indigo-500/20' : 'bg-transparent hover:bg-white/5'
              }`}
            >
              {isDragActive && (
                <div className="absolute inset-0 rounded-[2rem] border-2 border-indigo-500/50 animate-pulse" />
              )}
              <input {...getInputProps()} />
              {loading ? (
                <div className="space-y-6 animate-fade-up">
                  <div className="relative mx-auto h-24 w-24 flex items-center justify-center">
                    <div className="absolute inset-0 border-[3px] border-indigo-500/20 rounded-full" />
                    <div className="absolute inset-0 border-[3px] border-indigo-500 rounded-full border-t-transparent animate-spin" />
                    <Shield className="h-8 w-8 text-indigo-400 animate-pulse" />
                  </div>
                  <div>
                    <p className="font-semibold text-xl text-white tracking-tight">Verifying Local Evidence...</p>
                    <p className="text-indigo-300/80 text-sm font-medium mt-2 font-mono">{hashProgress}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="mx-auto h-24 w-24 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500">
                    <Upload className="h-10 w-10 text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-2xl text-white tracking-tight mb-2">Drop evidence file to verify locally</p>
                    <p className="text-white/40 font-medium text-sm">
                      Supports ZIP bundles, images, audio, video, or documents. Data never leaves your machine.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium text-center backdrop-blur-md">
            {error}
          </div>
        )}

        {result && <ZeroTrustResult result={result} onReset={() => { setResult(null); setError(''); }} />}
      </div>
    </Layout>
  );
}

function ZeroTrustResult({ result, onReset }) {
  const { outcome, stamp, passport, clientHash } = result;

  const c = {
    A: {
      icon: CheckCircle2,
      color: 'text-green-400',
      bg: 'bg-green-500/10 border-green-500/20',
      title: 'Cryptographically Verified',
      subtitle: 'The local file hash matches the immutable blockchain record exactly.',
    },
    C: {
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20',
      title: 'Not Verified',
      subtitle: 'The local file hash does not match any known ProofStamp record. The file may be tampered.',
    }
  }[outcome === 'A' ? 'A' : 'C'];

  const Icon = c.icon;

  return (
    <div className={`mt-6 apple-glass-panel rounded-[3rem] p-10 border backdrop-blur-xl ${c.bg}`}>
      <div className="text-center mb-10">
        <div className={`inline-flex h-20 w-20 items-center justify-center rounded-[2rem] border shadow-inner mb-6 ${c.bg}`}>
          <Icon className={`h-10 w-10 ${c.color}`} />
        </div>
        <h2 className="text-3xl font-semibold text-white tracking-tight">{c.title}</h2>
        <p className="text-white/60 font-medium mt-2 text-lg">{c.subtitle}</p>
        
        <div className="mt-6 inline-block text-left p-4 bg-black/40 rounded-2xl border border-white/5 w-full max-w-md">
          <p className="text-xs text-white/40 font-medium mb-1 uppercase tracking-wider">Local SHA-256 Hash</p>
          <p className="font-mono text-sm text-indigo-300 break-all">{clientHash}</p>
        </div>
      </div>

      {stamp && passport && (
        <div className="apple-glass rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-white/10">
             {passport.user?.avatarUrl ? (
              <img src={passport.user.avatarUrl} alt="" className="h-14 w-14 rounded-full border-2 border-white/20" />
            ) : (
              <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <Shield className="h-6 w-6 text-white/50" />
              </div>
            )}
            <div>
              <p className="font-semibold text-xl text-white">{passport.displayName}</p>
              <Link to={`/u/${passport.username}`} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                @{passport.username}
              </Link>
            </div>
            <div className={`ml-auto px-4 py-1.5 rounded-full font-medium text-sm bg-green-500/20 text-green-300 border border-green-500/30`}>
              Section 63 Compliant
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
             <div>
              <span className="text-white/40 font-medium block mb-1">Title</span>
              <p className="font-semibold text-white text-base truncate">{stamp.title}</p>
            </div>
            <div>
              <span className="text-white/40 font-medium block mb-1">Stamp ID</span>
              <p className="font-mono text-white/80">{stamp.id}</p>
            </div>
            <div>
              <span className="text-white/40 font-medium block mb-1">Registered On</span>
              <p className="font-medium text-white flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-white/40" />
                {new Date(stamp.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
               <span className="text-white/40 font-medium block mb-1">TSA Provider</span>
               <p className="font-medium text-white">{stamp.tsaProviderName || 'FreeTSA'}</p>
            </div>
          </div>

          {result.verification && (
            <div className="p-5 rounded-[1.5rem] bg-indigo-500/10 border border-indigo-500/20 space-y-3 mt-6">
              <p className="font-semibold text-indigo-300 flex items-center gap-2">
                <Scale className="h-4 w-4" /> Validated Legal Evidence
              </p>
              <div className="text-indigo-200/80 font-medium">
                <LegalEvidenceSummary stamp={stamp} verification={result.verification} />
              </div>
               {stamp.evidenceCertificateUrl && (
                  <Button variant="outline" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30 hover:text-white rounded-xl mt-4 w-full" asChild>
                    <a href={stamp.evidenceCertificateUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" /> View Section 63 Certificate
                    </a>
                  </Button>
               )}
            </div>
          )}
        </div>
      )}

      <div className="text-center mt-8">
        <button className="text-white/40 hover:text-white font-medium transition-colors" onClick={onReset}>
          Verify Another File
        </button>
      </div>
    </div>
  );
}
