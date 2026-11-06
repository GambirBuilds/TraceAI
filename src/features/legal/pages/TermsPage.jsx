/**
 * TraceAI Terms of Service Page
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export function TermsPage() {
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
              Terms of Service & Operational Boundaries
            </h1>
            <p className="text-xs text-slate-500 mt-2 font-mono">
              Version 2.4 · Effective March 2026
            </p>
          </div>

          <div className="prose prose-slate text-xs leading-relaxed space-y-6">
            <section className="p-6 bg-white border border-slate-200 rounded-xl space-y-2">
              <h2 className="text-sm font-bold text-slate-900">01. Probabilistic Nature of AI Detection</h2>
              <p>
                TraceAI provides computational stylometric and structural pattern analysis. Because generative AI models evolve continuously and human expression varies widely, no AI detection system can guarantee 100% accuracy. TraceAI assessments are probabilistic observations, not definitive proof of human or synthetic authorship.
              </p>
            </section>

            <section className="p-6 bg-white border border-slate-200 rounded-xl space-y-2">
              <h2 className="text-sm font-bold text-slate-900">02. Academic & Disciplinary Limitations</h2>
              <p>
                TraceAI strictly disclaims liability for unilateral disciplinary, legal, or academic actions taken solely based on automated output. Customers agree to use TraceAI as an investigative aid alongside human review, corroborating evidence, and interview procedures.
              </p>
            </section>

            <section className="p-6 bg-white border border-slate-200 rounded-xl space-y-2">
              <h2 className="text-sm font-bold text-slate-900">03. Acceptable Use Policy</h2>
              <p>
                Users agree not to use TraceAI to harass, defame, or unjustly accuse individuals. You must hold necessary rights or lawful grounds to inspect uploaded media assets.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TermsPage;
