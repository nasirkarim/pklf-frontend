import React from 'react';
import { X, RotateCcw } from 'lucide-react';

export const ActiveFilters = ({ filters = {}, onRemoveFilter, onClearAll }) => {
  const activeChips = [];

  if (filters.keyword && filters.keyword.trim()) {
    activeChips.push({
      key: 'keyword',
      label: `Keyword: "${filters.keyword}"`,
    });
  }

  if (filters.type && filters.type !== 'ALL') {
    activeChips.push({
      key: 'type',
      label: `Type: ${filters.type === 'LOST' ? 'Lost' : 'Found'}`,
    });
  }

  if (filters.category && filters.category !== 'all') {
    activeChips.push({
      key: 'category',
      label: `Category: ${filters.category}`,
    });
  }

  if (filters.city && filters.city !== 'All Cities') {
    activeChips.push({
      key: 'city',
      label: `City: ${filters.city}`,
    });
  }

  if (filters.area && filters.area.trim()) {
    activeChips.push({
      key: 'area',
      label: `Area: ${filters.area}`,
    });
  }

  if (filters.brand && filters.brand.trim()) {
    activeChips.push({
      key: 'brand',
      label: `Brand: ${filters.brand}`,
    });
  }

  if (filters.color && filters.color.trim()) {
    activeChips.push({
      key: 'color',
      label: `Color: ${filters.color}`,
    });
  }

  if (filters.fromDate) {
    activeChips.push({
      key: 'fromDate',
      label: `From: ${filters.fromDate}`,
    });
  }

  if (filters.toDate) {
    activeChips.push({
      key: 'toDate',
      label: `To: ${filters.toDate}`,
    });
  }

  if (activeChips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
        Active Filters:
      </span>

      {activeChips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={() => onRemoveFilter(chip.key)}
            className="hover:bg-emerald-200/60 rounded-full p-0.5 text-emerald-700 hover:text-emerald-950 transition cursor-pointer"
            title={`Remove ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
};

export default ActiveFilters;
