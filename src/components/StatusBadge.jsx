import React from 'react';

export const StatusBadge = ({ type, text, size = 'sm' }) => {
  const normalized = (type || text || '').toLowerCase().replace(/[\s-]+/g, '_');

  const configs = {
    lost: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      defaultLabel: 'Lost Item',
    },
    found: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-600',
      defaultLabel: 'Found Item',
    },
    active: {
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      dot: 'bg-sky-500',
      defaultLabel: 'Active',
    },
    open: {
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      dot: 'bg-sky-500',
      defaultLabel: 'Active / Open',
    },
    pending: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      defaultLabel: 'Pending',
    },
    pending_claim: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      defaultLabel: 'Claim Pending',
    },
    under_review: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      defaultLabel: 'Under Review',
    },
    matched: {
      bg: 'bg-purple-50 text-purple-800 border-purple-200',
      dot: 'bg-purple-600',
      defaultLabel: 'Match Confirmed',
    },
    possible_match: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      defaultLabel: 'Possible Match',
    },
    located: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-600',
      defaultLabel: 'Located',
    },
    handover_pending: {
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      dot: 'bg-indigo-600',
      defaultLabel: 'Handover Pending',
    },
    recovered: {
      bg: 'bg-teal-50 text-teal-800 border-teal-200',
      dot: 'bg-teal-600',
      defaultLabel: 'Recovered',
    },
    resolved: {
      bg: 'bg-teal-50 text-teal-800 border-teal-200',
      dot: 'bg-teal-600',
      defaultLabel: 'Recovered / Resolved',
    },
    approved: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-600',
      defaultLabel: 'Approved',
    },
    rejected: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-400',
      defaultLabel: 'Rejected',
    },
    cancelled: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      defaultLabel: 'Cancelled',
    },
    closed: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      defaultLabel: 'Closed',
    },
  };

  const current = configs[normalized] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    defaultLabel: text || type,
  };

  const sizeClasses = size === 'xs'
    ? 'text-[11px] px-2 py-0.5'
    : size === 'lg'
    ? 'text-sm px-3.5 py-1.5'
    : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-2xs font-sans tracking-wide ${current.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`}></span>
      <span>{text || current.defaultLabel}</span>
    </span>
  );
};

export default StatusBadge;
