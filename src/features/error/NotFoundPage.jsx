/**
 * TraceAI 404 Not Found Page
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Button } from '../../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">
        404 — Route Not Found
      </span>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 mb-2">
        Page Does Not Exist
      </h1>
      <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
        The forensic intelligence route or investigation dossier you requested could not be located in our system index.
      </p>

      <div className="flex items-center gap-3">
        <Link to="/app">
          <Button variant="primary" icon={LayoutDashboard} size="sm">
            Return to Dashboard
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" size="sm">
            Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
