/**
 * TraceAI Data Governance & Compliance Framework
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, CheckCircle2, Lock, Database, Server } from 'lucide-react';

export function DataGovernancePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-lg">Trace<span className="text-blue-600">AI</span></span>
          </Link>
          <Link to="/app" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Workspace</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Data Governance & Enterprise Compliance
            </h1>
            <p className="text-xs text-slate-500 mt-2 font-mono">
              SOC2 Type II, ISO/IEC 27001 & C2PA Trust Framework Alignment
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <Lock className="w-5 h-5 text-blue-600 mb-2" />
              <div className="text-xs font-bold text-slate-900">AES-256 Encryption</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Data at rest encrypted via AES-256; TLS 1.3 enforced for all transmission.
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <Server className="w-5 h-5 text-indigo-600 mb-2" />
              <div className="text-xs font-bold text-slate-900">Regional Data Residency</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Customer files processed in designated regional sovereign clusters.
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <Database className="w-5 h-5 text-emerald-600 mb-2" />
              <div className="text-xs font-bold text-slate-900">Automated Purge Cycles</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Configurable retention limits ensure compliant lifecycle destruction.
              </div>
            </div>
          </div>

          <div className="prose prose-slate text-xs leading-relaxed space-y-6">
            <section className="p-6 bg-white border border-slate-200 rounded-xl space-y-2">
              <h2 className="text-sm font-bold text-slate-900">01. Content Authenticity Initiative (CAI) & C2PA</h2>
              <p>
                TraceAI implements native Coalition for Content Provenance and Authenticity (C2PA) validation specifications. Our cryptographic engines verify signature manifests without retaining raw cryptographic private keys.
              </p>
            </section>

            <section className="p-6 bg-white border border-slate-200 rounded-xl space-y-2">
              <h2 className="text-sm font-bold text-slate-900">02. Immutable Audit Logging</h2>
              <p>
                Every administrative configuration change, role elevation, and dossier export is recorded into tamper-evident audit logs accessible only to verified administrators.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DataGovernancePage;
