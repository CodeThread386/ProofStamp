import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Server, Key, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DataRetentionPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-12 font-sans selection:bg-white/20 selection:text-white">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" className="mb-8 hover:bg-white/10 text-white" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tighter mb-4 text-white">
          Data Retention & SLA
        </h1>
        <p className="text-xl text-white/50 mb-12 max-w-2xl font-medium tracking-tight">
          ProofStamp is legally engineered to support long-term evidentiary chains. Our infrastructure commitments ensure your proofs survive litigation timelines.
        </p>

        <div className="space-y-12 text-white/80 leading-relaxed font-medium">
          
          <section className="apple-glass-panel p-8 rounded-[2rem] border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/5 rounded-xl">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">10-Year Audit Log Preservation</h2>
            </div>
            <p className="mb-4">
              Legal battles can take years to unfold. ProofStamp guarantees that all metadata, IP logs, cryptographic hashes, and user attestation payloads associated with your stamped assets are maintained in immutable, offline-backed storage for a minimum of <strong>10 years</strong> from the date of stamping.
            </p>
            <p>
              This ensures that even if ProofStamp discontinues the active dashboard interface, the underlying database records necessary to prove origin in court will remain accessible for statutory litigation periods.
            </p>
          </section>

          <section className="apple-glass-panel p-8 rounded-[2rem] border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/5 rounded-xl">
                <Key className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">HSM-Backed Key Escrow</h2>
            </div>
            <p className="mb-4">
              Your Proof Passport is secured by an RSA-2048 keypair. The private keys used to generate your digital signatures are encrypted at rest using a central `KEY_ENCRYPTION_KEY`.
            </p>
            <p>
              We commit to storing the master encryption keys inside enterprise-grade Hardware Security Modules (HSMs), preventing any single employee or rogue process from exporting them. A formal escrow mechanism guarantees key availability exclusively for court-ordered verification procedures.
            </p>
          </section>

          <section className="apple-glass-panel p-8 rounded-[2rem] border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/5 rounded-xl">
                <Server className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Decentralized Anchor Fallback</h2>
            </div>
            <p className="mb-4">
              To further remove dependency on ProofStamp as a single point of failure, all stamp hashes are periodically anchored into the Bitcoin blockchain via OpenTimestamps.
            </p>
            <p>
              You receive the `.ots` receipt in your Counsel Evidence Packet. This allows you to cryptographically prove the file existed at that exact time, independently verifying the timestamp against the public Bitcoin ledger using any standard OTS client, regardless of ProofStamp's operational status.
            </p>
          </section>

          <section className="mt-16 text-sm text-white/40 border-t border-white/10 pt-8">
            <p className="uppercase tracking-widest font-semibold mb-2">Legal Disclaimer</p>
            <p>
              ProofStamp creates evidentiary records designed for court admissibility under BSA Section 63. However, ProofStamp is not proof of legal ownership and does not substitute for formal copyright registration or legal counsel. Always consult an advocate for specific litigation strategies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
