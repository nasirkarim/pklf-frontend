import React from 'react';
import { Activity, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useApiHealth } from '../hooks/useApiHealth';

export const ApiStatusBadge = () => {
  const { status, data, error, refetch } = useApiHealth();

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all bg-white shadow-xs">
      {status === 'checking' && (
        <>
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
          <span className="text-slate-600">Connecting to API...</span>
        </>
      )}

      {status === 'connected' && (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-700 font-semibold">API Live</span>
          {data?.database && (
            <span className="text-slate-400 border-l border-slate-200 pl-1.5 text-[11px]">
              DB: {data.database}
            </span>
          )}
        </>
      )}

      {status === 'error' && (
        <button
          onClick={refetch}
          title={error || 'Click to retry'}
          className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span>API Offline</span>
          <RefreshCw className="w-3 h-3 ml-0.5" />
        </button>
      )}
    </div>
  );
};

export default ApiStatusBadge;
