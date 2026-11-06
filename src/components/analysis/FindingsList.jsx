/**
 * TraceAI Findings List Component
 * Renders structured forensic observations with semantic indicators.
 */

import React from 'react';
import { CheckCircle2, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export function FindingsList({ findings = [] }) {
  if (!findings || findings.length === 0) {
    return (
      <div className="text-xs text-slate-500 py-3 text-center">
        No specific anomalies or patterns flagged for this content.
      </div>
    );
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'authentic':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
      case 'notable':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
      case 'caution':
        return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />;
      case 'neutral':
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />;
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 'authentic':
        return 'Authenticity Marker';
      case 'notable':
        return 'Notable Anomaly';
      case 'caution':
        return 'Significant Deviation';
      case 'neutral':
      default:
        return 'Structural Observation';
    }
  };

  return (
    <div className="space-y-3">
      {findings.map((item, index) => (
        <div
          key={item.id || index}
          className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-slate-300 transition-colors"
        >
          <div className="flex items-start gap-3">
            {getSeverityIcon(item.severity)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-semibold text-slate-900 truncate">
                  {item.title}
                </h4>
                <span className="text-[11px] text-slate-500 font-medium shrink-0">
                  {getSeverityLabel(item.severity)}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FindingsList;
