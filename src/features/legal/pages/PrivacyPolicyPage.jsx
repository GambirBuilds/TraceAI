/**
 * TraceAI Privacy Policy Page
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export function PrivacyPolicyPage() {
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
              Privacy Policy & Content Custody
            </h1>
            <p className="text-xs text-slate-500 mt-2 font-mono">
              Effective Date: March 2026 · TraceAI Global Operations
            </p>
          </div>

          <div className="prose prose-slate text-xs leading-relaxed space-y-6">
            <section className="p-6 bg-white border border-slate-200 rounded-xl space-y-2">
              <h2 className="text-sm font-bold text-slate-900">01. Zero Training on Customer Submissions</h2>
              <p>
                TraceAI strictly adheres to an immutable zero-training guarantee. Any text, images, audio, or video files uploaded to TraceAI for authenticity inspection are never used to train, retrain, or fine-tune machine learning or foundational AI models.
              </p>
            </section>

            <section className="p-6 bg-white border border-slate-200 rounded-xl space-y-2">
              <h2 className="text-sm font-bold text-slate-900">02. Ephemeral Storage & Retention Policies</h2>
              <p>
                Unless configured for archival retention by enterprise administrators, processed multimedia assets are stripped from scratch storage upon analysis completion. Local browser session records reside exclusively in client-side storage unless synchronized with your secure database.
              </p>
            </section>

            <section className="p-6 bg-white border border-slate-200 rounded-xl space-y-2">
              <h2 className="text-sm font-bold text-slate-900">03. Cryptographic Provenance & C2PA</h2>
              <p>
                When inspecting C2PA Content Credentials, TraceAI only validates the public signing chain and assertions embedded within the container. No private biometric data or personal identifiers are stored.
              </p>
            </section>

            <section className="p-6 bg-white border border-slate-200 rounded-xl space-y-2">
              <h2 className="text-sm font-bold text-slate-900">04. Data Subject Rights & Purging</h2>
              <p>
                Users maintain full sovereignty over their evaluation records. You may trigger an instantaneous purge of all historical analyses and cached metadata via the Settings & Governance panel at any time.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PrivacyPolicyPage;
