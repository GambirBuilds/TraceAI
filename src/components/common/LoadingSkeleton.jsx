/**
 * TraceAI Loading Skeleton Component
 */

import React from 'react';

export function LoadingSkeleton({ className = '', count = 1 }) {
  return (
    <div className="space-y-2.5 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-slate-200/70 animate-pulse rounded-md ${className || 'h-4 w-full'}`}
        />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="py-3.5 px-4 flex items-center justify-between gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className={`h-4 bg-slate-200/70 animate-pulse rounded ${c === 0 ? 'w-1/3' : 'w-1/6'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
