/**
 * TraceAI Confidence & Provenance Indicator
 * Conveys calibration levels and differentiates likelihood, model confidence, and forensic evidence.
 */

import React from 'react';
import { ShieldCheck, HelpCircle, FileCheck, Info } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

export function ConfidenceIndicator({
  assessment,
  provenance,
  model
}) {
  const isProvenanceAvailable = Boolean(provenance?.available);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Assessment Label */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Observed Assessment</span>
          <Tooltip text="Statistical characterization of detected patterns">
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </Tooltip>
        </div>
        <div className="text-sm font-semibold text-slate-900 truncate">
          {assessment?.label || 'Inconclusive / Pending'}
        </div>
        <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
          {assessment?.scoreMeaning || 'Pattern evaluation completed'}
        </div>
      </div>

      {/* Provenance Status */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Cryptographic Provenance</span>
          <Tooltip text="Hardware sensor or C2PA manifest verification">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </Tooltip>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
          {isProvenanceAvailable ? (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified Manifest</span>
            </>
          ) : (
            <>
              <FileCheck className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Unsigned Asset</span>
            </>
          )}
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          {isProvenanceAvailable ? 'Embedded source credentials' : 'No C2PA manifest found'}
        </div>
      </div>

      {/* Model Spec */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Inspector Engine</span>
          <Tooltip text="Algorithm specification used for this run">
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </Tooltip>
        </div>
        <div className="text-sm font-semibold text-slate-900 truncate">
          {model?.name || 'TraceAI Forensics Engine'}
        </div>
        <div className="text-[11px] font-mono text-slate-500 mt-1">
          {model?.version || 'v1.4'} · Deterministic
        </div>
      </div>
    </div>
  );
}

export default ConfidenceIndicator;
