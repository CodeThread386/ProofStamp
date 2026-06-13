import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import LegalLayout from './LegalLayout';
import { MARKETING, TSA_BADGES, BSA_FRAME } from '@/content/legalCopy';
import { LEGAL_SCENARIOS, SCENARIOS_SUMMARY } from '@/content/legalScenarios';
import { FileText, ShieldAlert } from 'lucide-react';

export default function LegalGuidePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'admissibility';
  const setActiveTab = (newTab) => {
    setSearchParams(prev => { prev.set('tab', newTab); return prev; });
  };
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const sidebar = (
    <nav className="flex flex-col gap-2">
      <button
        onClick={() => setActiveTab('admissibility')}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left transition-all ${activeTab === 'admissibility' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white/80'}`}
      >
        <FileText className="h-5 w-5" />
        Indian Admissibility Guide
      </button>
      <button
        onClick={() => setActiveTab('scenarios')}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left transition-all ${activeTab === 'scenarios' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent'}`}
      >
        <ShieldAlert className="h-5 w-5" />
        Defeating Attacks
      </button>
    </nav>
  );

  return (
    <LegalLayout 
      title={activeTab === 'admissibility' ? "India Admissibility Guide" : "Courtroom Defense Scenarios"} 
      maxWidth="max-w-6xl"
      sidebar={sidebar}
    >
      {activeTab === 'admissibility' ? (
        <div className="animate-fade-up">
          <p>
            This guide explains what ProofStamp produces and what it does <strong>not</strong> replace.
            Always consult a qualified advocate for your specific dispute.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">What ProofStamp provides</h2>
          <table className="w-full text-left border border-white/10 rounded-xl overflow-hidden text-sm mb-8">
            <thead className="bg-white/5 text-white/90">
              <tr>
                <th className="p-4 font-semibold border-b border-white/10">Artifact</th>
                <th className="p-4 font-semibold border-b border-white/10">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 align-top font-medium text-white/90">SHA-256 fingerprint</td>
                <td className="p-4 text-white/70">Proves the file you registered matches a specific byte sequence</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 align-top font-medium text-white/90">RSA-2048 signature</td>
                <td className="p-4 text-white/70">Binds the stamp to your Passport identity at registration time</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 align-top font-medium text-white/90">RFC 3161 timestamp</td>
                <td className="p-4 text-white/70">Independent time witness from a Timestamp Authority (not ProofStamp&apos;s clock alone)</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 align-top font-medium text-white/90">{BSA_FRAME.shortLabel}</td>
                <td className="p-4 text-white/70">Describes the computer system output under {BSA_FRAME.act} — not authorship or ownership</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 align-top font-medium text-white/90">Creator declaration</td>
                <td className="p-4 text-white/70">Your attested statement of authorship/rights (separate from system certificate)</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 align-top font-medium text-white/90">{MARKETING.counselPacketName}</td>
                <td className="p-4 text-white/70">ZIP for your advocate: proof JSON, both PDFs, TSA token, affidavit template, FOR_YOUR_ADVOCATE.md</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-xl font-bold text-white mt-12 mb-4">What ProofStamp is not</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Not</strong> a guarantee you will win in court or on social platforms</li>
            <li><strong>Not</strong> automatic removal of infringing content — you file notice via a lawyer</li>
            <li><strong>Not</strong> legal advice</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-12 mb-4">API: artifacts per stamp</h2>
          <p className="mb-4">
            For any public Stamp ID, see the catalog of claims and download URLs:
          </p>
          <code className="block bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-mono text-white/80 break-all mb-8">
            GET /legal/PS-YYYY-XXXXX/artifacts
          </code>

          <h2 className="text-xl font-bold text-white mt-12 mb-4">Recommended use</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Stamp work before you publish or share widely</li>
            <li>Complete creator declaration attestation on the stamp page</li>
            <li>Download the {MARKETING.counselPacketName} and store offline</li>
            <li>Enable monitoring for images you publish online ({MARKETING.monitoringLanding})</li>
            <li>When infringed, file DMCA with the packet attached</li>
          </ol>
        </div>
      ) : (
        <div className="animate-fade-up space-y-8">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-200">
            <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" /> 
              The Reality of Litigation
            </h3>
            <p className="text-sm leading-relaxed text-red-200/80">
              When opposing counsel attacks your evidence, they are attacking the mathematical foundation of your claim. 
              These scenarios demonstrate exactly how ProofStamp's layered cryptographic architecture defeats adversarial 
              challenges in a courtroom setting.
            </p>
          </div>

          <div className="space-y-8">
            {LEGAL_SCENARIOS.map((scenario, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-colors">
                <h3 className="text-xl font-bold text-white mb-4">{scenario.title}</h3>
                <div className="bg-black/30 rounded-xl p-4 mb-4 border border-white/5">
                  <p className="font-medium text-white/80 italic">
                    {scenario.question}
                  </p>
                </div>
                <div className="prose prose-invert max-w-none text-white/70">
                  <p className="leading-relaxed">
                    {scenario.answer.replace('The answer: ', '')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </LegalLayout>
  );
}
