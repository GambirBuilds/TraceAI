/**
 * TraceAI Empty State Component
 */

import React from 'react';
import { Search } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = Search,
  title = 'No records found',
  description = 'Try adjusting your search criteria or filter selections.',
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 bg-white border border-dashed border-slate-200 rounded-xl ${className}`}>
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3.5">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
