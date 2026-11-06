/**
 * TraceAI Page Container Component
 * Standard layout shell with consistent typography, spacing, and action bars.
 */

import React from 'react';

export function PageContainer({
  title,
  description,
  actions,
  children,
  maxWidth = 'max-w-7xl',
  className = ''
}) {
  return (
    <div className={`p-4 sm:p-6 lg:p-8 ${maxWidth} mx-auto w-full ${className}`}>
      {(title || description || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            {title && (
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed max-w-3xl">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {children}
    </div>
  );
}

export default PageContainer;
