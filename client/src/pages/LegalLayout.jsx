import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LegalLayout({ title, children, maxWidth = 'max-w-3xl', sidebar = null }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white">
            <Shield className="h-6 w-6 text-white" />
            ProofStamp
          </Link>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-1" /> Home
            </Link>
          </Button>
        </div>
      </header>
      <main className={`${maxWidth} mx-auto px-6 py-12 flex flex-col md:flex-row gap-12`}>
        {sidebar && (
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-24">
              {sidebar}
            </div>
          </aside>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-white mb-8">{title}</h1>
          <div className="prose prose-invert max-w-none text-white/70 space-y-4 text-sm leading-relaxed">
            {children}
          </div>
          <footer className="mt-12 pt-8 border-t border-white/10 text-sm text-white/50 flex flex-wrap gap-6">
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/legal-guide" className="hover:text-white transition-colors">Legal Guide</Link>
          </footer>
        </div>
      </main>
    </div>
  );
}
