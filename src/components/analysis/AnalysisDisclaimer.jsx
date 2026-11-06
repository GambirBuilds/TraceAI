/**
 * TraceAI Responsible AI Disclaimer Component
 * Transparently communicates that computational indicators do not prove authorship.
 */

import React from 'react';
import { ShieldAlert } from 'lucide-react';

export function AnalysisDisclaimer({ limitations = [], compact = false }) {
  return (
    <div className={`bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 ${compact ? 'py-3 px-3.5' : ''}`}>
      <div className="flex items-center gap-2 font-semibold text-slate-800 mb-1.5">
        <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0" />
        <span>Forensic Limitations & Responsible AI Notice</span>
      </div>
      <p className="leading-relaxed">
        TraceAI investigates structural patterns, compression artifacts, and cryptographic provenance. Statistical regularities alone do not prove authorship or human vs. synthetic origin. False positives and negatives occur. Always corroborate findings with external provenance.
      </p>

      {limitations && limitations.length > 0 && (
        <ul className="mt-2.5 space-y-1 list-disc pl-4 text-slate-500">
          {limitations.map((lim, index) => (
            <li key={index} className="leading-normal">{lim}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AnalysisDisclaimer;
