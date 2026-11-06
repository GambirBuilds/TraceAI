/**
 * TraceAI Global Error Boundary
 * Catches unhandled runtime exceptions gracefully with recovery actions.
 */

import React, { Component } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled TraceAI React Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/app';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <span className="text-xs font-mono font-semibold text-rose-600 uppercase">
            Application Exception Caught
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 mb-2">
            Something went wrong
          </h1>
          <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
            TraceAI encountered an unexpected runtime fault while rendering this view. You can reload the workspace or return to the overview dashboard.
          </p>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              icon={RefreshCw}
              onClick={this.handleReload}
            >
              Reload Workspace
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Home}
              onClick={this.handleReset}
            >
              Back to Overview
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
