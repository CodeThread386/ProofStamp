import React from 'react';
import { ShieldAlert, RefreshCw, Trash2 } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
    try {
      localStorage.setItem('last_crash', error.toString() + '\n' + errorInfo.componentStack);
    } catch (e) {}
  }

  handleClearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative selection:bg-white/20 selection:text-white">
          <div className="ambient-glow fixed inset-0 pointer-events-none" />
          <div className="max-w-3xl w-full apple-glass-panel border border-red-500/20 bg-black/50 rounded-[2.5rem] p-8 sm:p-10 apple-shadow relative z-10 animate-fade-up flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-red-500/10 border border-red-500/20 shrink-0">
                <ShieldAlert className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Application Crash</h1>
                <p className="text-white/60 font-medium text-sm">
                  An unexpected error occurred while rendering this component.
                </p>
              </div>
            </div>

            <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-4 mb-6 overflow-x-auto">
              <h2 className="text-red-400 font-mono text-sm mb-2 break-all font-semibold">
                {this.state.error && this.state.error.toString()}
              </h2>
              {this.state.errorInfo && (
                <pre className="text-red-300/80 font-mono text-xs whitespace-pre-wrap mt-2 pt-2 border-t border-red-500/20">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors shadow-lg"
              >
                <RefreshCw className="h-5 w-5" />
                Reload Page
              </button>
              <button 
                onClick={this.handleClearCache}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
                Clear Session & Restart
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children; 
  }
}
