import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ message = 'Loading reports...', fullHeight = false }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${
        fullHeight ? 'min-h-[400px]' : 'py-12'
      }`}
    >
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-700" />
      </div>
      <p className="text-sm font-medium text-slate-700">{message}</p>
      <p className="text-xs text-slate-400 mt-1">Connecting to REUNIVO network</p>
    </div>
  );
};

export default Loading;
