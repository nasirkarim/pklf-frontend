import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 12,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with window around current page
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
      {/* Item range count */}
      <div className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-900">{startItem}</span> to{' '}
        <span className="font-semibold text-slate-900">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-900">{totalItems}</span> reports
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
            currentPage <= 1
              ? 'opacity-40 border-slate-200 text-slate-400 cursor-not-allowed'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page buttons */}
        {pages[0] > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className="w-8 h-8 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              1
            </button>
            {pages[0] > 2 && <span className="text-slate-400 px-1 text-xs">...</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-xl text-xs font-semibold transition cursor-pointer ${
              currentPage === p
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {p}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="text-slate-400 px-1 text-xs">...</span>
            )}
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className="w-8 h-8 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
            currentPage >= totalPages
              ? 'opacity-40 border-slate-200 text-slate-400 cursor-not-allowed'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
