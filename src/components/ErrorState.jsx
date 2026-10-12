import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  description = 'An unexpected error occurred while loading reports. Please check your connection and retry.',
  onRetry,
}) => {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 sm:p-10 text-center max-w-lg mx-auto my-6">
      <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mb-6 leading-relaxed">
        {description}
      </p>

      {onRetry && (
        <Button variant="danger" size="md" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
