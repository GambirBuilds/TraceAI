/**
 * TraceAI Status & Metadata Label
 * Designed in compliance with zero-pill discipline: restrained, unboxed or minimal square-radius styling.
 */

import React from 'react';

export function Badge({
  children,
  variant = 'neutral', // 'neutral' | 'info' | 'success' | 'warning' | 'error'
  isInteractive = false,
  onClick,
  className = ''
}) {
  const variantStyles = {
    neutral: 'text-slate-600 bg-slate-100 border-slate-200',
    info: 'text-blue-700 bg-blue-50 border-blue-200',
    success: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    warning: 'text-amber-800 bg-amber-50 border-amber-200',
    error: 'text-rose-700 bg-rose-50 border-rose-200'
  };

  const Component = isInteractive ? 'button' : 'span';

  return (
    <Component
      onClick={isInteractive ? onClick : undefined}
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-md transition-colors ${variantStyles[variant] || variantStyles.neutral} ${isInteractive ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
    >
      {children}
    </Component>
  );
}

export default Badge;
