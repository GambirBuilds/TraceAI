/**
 * TraceAI Error State Component
 */

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = 'Analysis Failed',
  message = 'An unexpected error occurred while processing the content.',
  onRetry,
  className = ''
}) {
  return (
    <div className={`p-6 bg-rose-50/60 border border-rose-200 rounded-xl text-center flex flex-col items-center justify-center ${className}`}>
      <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-rose-900">{title}</h4>
      <p className="text-xs text-rose-700 max-w-md mt-1 leading-relaxed">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onRetry} icon={RefreshCw}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}

export default ErrorState;
