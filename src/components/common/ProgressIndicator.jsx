/**
 * TraceAI Progress Indicator Component
 */

import React from 'react';

export function ProgressIndicator({
  percent = 0,
  step = 'Processing...',
  category = 'content'
}) {
  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
      <div className="flex items-center justify-between text-xs text-slate-600 mb-2 font-medium">
        <span>Evaluating {category}</span>
        <span className="tabular-nums font-mono text-blue-600 font-semibold">{percent}%</span>
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
        />
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping shrink-0" />
        <span className="truncate">{step}</span>
      </div>
    </div>
  );
}

export default ProgressIndicator;
