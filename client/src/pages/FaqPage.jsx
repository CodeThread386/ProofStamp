import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import LegalLayout from './LegalLayout';
import { MARKETING, TSA_BADGES, BSA_FRAME } from '@/content/legalCopy';
import { LEGAL_SCENARIOS, SCENARIOS_SUMMARY } from '@/content/legalScenarios';
import { COMPARISONS } from '@/content/comparisons';
import { LEGAL_COMPLIANCE } from '@/content/legalCompliance';
import { FileText, ShieldAlert, Scale, ShieldCheck } from 'lucide-react';

export default function FaqPage() {
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
        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left transition-all whitespace-nowrap ${activeTab === 'admissibility' ? 'bg-white/10 text-white border border-white/10' : 'text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent'}`}
      >
        <FileText className="h-5 w-5 shrink-0" />
        Indian Admissibility Guide
      </button>
      <button
        onClick={() => setActiveTab('compliance')}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left transition-all whitespace-nowrap ${activeTab === 'compliance' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent'}`}
      >
        <ShieldCheck className="h-5 w-5 shrink-0" />
        Legal Compliance Matrix
      </button>
      <button
        onClick={() => setActiveTab('scenarios')}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left transition-all whitespace-nowrap ${activeTab === 'scenarios' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent'}`}
      >
        <ShieldAlert className="h-5 w-5 shrink-0" />
        Defeating Attacks
      </button>
      <button
        onClick={() => setActiveTab('comparisons')}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left transition-all whitespace-nowrap ${activeTab === 'comparisons' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent'}`}
      >
        <Scale className="h-5 w-5 shrink-0" />
        Why ProofStamp
      </button>
    </nav>
  );

  return (
    <LegalLayout 
      title={activeTab === 'admissibility' ? "India Admissibility Guide" : activeTab === 'compliance' ? "Legal Compliance Matrix" : activeTab === 'scenarios' ? "Courtroom Defense Scenarios" : "Why ProofStamp"} 
      maxWidth="max-w-6xl"
      sidebar={sidebar}
    >
      {activeTab === 'admissibility' ? (
        <div className="animate-fade-up">
          {/* Affirmative Thesis Statement */}
          <div className="bg-white/5 border-l-4 border-l-white/80 border-y border-r border-white/10 rounded-r-2xl p-6 md:p-8 mb-10 text-white/80 leading-relaxed shadow-lg backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">The core question in any IP dispute: Who created it first?</h3>
            <p className="mb-4 text-lg">
              Not who registered it first. Not who filed first. <strong>Who created it first.</strong>
            </p>
            <p className="mb-4">
              Under the Copyright Act 1957, copyright vests automatically at the exact moment of creation. Registration is merely evidence of ownership, not the source of it—a principle the Supreme Court of India has affirmed repeatedly. 
            </p>
            <p className="text-white font-medium">
              ProofStamp arms you with the undeniable, court-admissible technical proof you need to answer that core question decisively the moment you step into a courtroom.
            </p>
          </div>

          <p className="text-sm text-white/50 mb-8 border-b border-white/10 pb-6">
            This guide explains exactly what evidentiary artifacts ProofStamp produces and what it does <strong>not</strong> replace. Always consult a qualified advocate for your specific dispute.
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
                <td className="p-4 align-top font-medium text-white/90">Aadhaar eKYC Identity</td>
                <td className="p-4 text-white/70">Cryptographically binds your Proof Passport to a government-verified identity</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 align-top font-medium text-white/90">DWT-DCT Watermark</td>
                <td className="p-4 text-white/70">Imperceptible forensic signature embedded into image pixels that survives compression and cropping</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 align-top font-medium text-white/90">RSA-2048 signature</td>
                <td className="p-4 text-white/70">Binds the stamp to your Passport identity at registration time</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 align-top font-medium text-white/90">RFC 3161 timestamp</td>
                <td className="p-4 text-white/70">Independent time witness from a third-party Timestamp Authority, verifiable without ProofStamp's servers.</td>
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
                <td className="p-4 text-white/70">ZIP for your advocate containing proof JSON, both PDFs, TSA token, affidavit template, and a plain-English guide your lawyer can act on immediately.</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-xl font-bold text-white mt-12 mb-4">What ProofStamp is not</h2>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong>Not a guarantee you will win in court</strong> — because no platform, lawyer, or technology can guarantee that. What ProofStamp guarantees is that when you walk in, you carry the strongest independently verifiable evidentiary record available to any creator in India today.</li>
            <li><strong>Not legal advice</strong> — because legal advice costs thousands and takes weeks. ProofStamp gives your lawyer everything they need to advise you faster, cheaper, and with more confidence than they have ever had before.</li>
            <li><strong>Not proof of ownership</strong> — because no authority on earth can guarantee ownership, it is to be decided by court. What ProofStamp gives you is stronger presumption of ownership: an independently verifiable, government-examiner certified record of exactly who had this file, and exactly when.</li>
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
            <li>Complete Aadhaar-backed creator declaration attestation on the stamp page</li>
            <li>Download the {MARKETING.counselPacketName} and store offline</li>
            <li>Enable monitoring for images you publish online ({MARKETING.monitoringLanding})</li>
            <li>When infringed, use the automated Takedown Center to dispatch notices with the packet attached</li>
          </ol>
        </div>
      ) : activeTab === 'compliance' ? (
        <div className="animate-fade-up space-y-8">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-emerald-200">
            <h3 className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> 
              Legal Compliance & Credibility
            </h3>
            <p className="text-sm leading-relaxed text-emerald-200/80">
              A detailed breakdown of ProofStamp's alignment with Indian statutory frameworks, including the Copyright Act 1957, BSA 2023, IT Act 2000, and DPDP Act.
            </p>
          </div>

          <div className="space-y-12">
            {LEGAL_COMPLIANCE.map((group, idx) => (
              <div key={idx}>
                <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">{group.part}</h3>
                <div className="space-y-6">
                  {group.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-colors">
                      <h4 className="text-xl font-semibold text-white mb-4">{sec.title}</h4>
                      <div className="prose prose-invert max-w-none text-white/70 whitespace-pre-wrap">
                        {sec.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'scenarios' ? (
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
      ) : (
        <div className="animate-fade-up space-y-8">
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 text-indigo-200">
            <h3 className="text-lg font-bold text-indigo-400 mb-2 flex items-center gap-2">
              <Scale className="h-5 w-5" /> 
              How We Stand Out
            </h3>
            <p className="text-sm leading-relaxed text-indigo-200/80">
              Understand how ProofStamp compares to traditional registries, digital signature platforms, and other digital forensic tools in the market.
            </p>
          </div>

          <div className="space-y-8">
            {COMPARISONS.map((comp, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-colors">
                <h3 className="text-xl font-bold text-white mb-4">{comp.title}</h3>
                <div className="prose prose-invert max-w-none text-white/70">
                  <p className="leading-relaxed">
                    {comp.content}
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
