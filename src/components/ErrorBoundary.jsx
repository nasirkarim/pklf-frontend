import React from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught render error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 p-8 sm:p-10 text-center shadow-lg space-y-5">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Something went wrong
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                An unexpected interface error occurred. Your reported data and account remain safe. You can reload this view or navigate back to the home page.
              </p>
            </div>

            {(Boolean(import.meta.env?.DEV) || (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development')) && this.state.error?.message && (
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-left text-xs text-rose-600 font-mono break-all max-h-32 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-800 transition shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
