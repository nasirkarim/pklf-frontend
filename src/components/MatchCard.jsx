import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

export const MatchCard = ({ matchItem }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!matchItem || !matchItem.report) return null;

  const { report, score, label, breakdown = {} } = matchItem;

  const id = report._id || report.id;
  const reportType = report.type || report.reportType || 'FOUND';
  const title = report.title || 'Untitled Report';
  const category = report.category || 'General';
  const city = report.foundCity || report.city || 'Pakistan';
  const area = report.foundArea || report.area || '';
  const currentLocation = report.currentLocation || '';

  const rawDate = reportType === 'FOUND'
    ? (report.foundDate || report.date || report.lostDate)
    : (report.lostDate || report.date || report.foundDate);

  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown date';

  // Photo resolution
  let photo = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80';
  if (report.photos && report.photos.length > 0) {
    photo = report.photos[0];
  } else if (report.image) {
    photo = report.image;
  }

  // Determine score color scheme
  let badgeClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let barClasses = 'bg-emerald-600';

  if (score < 65) {
    badgeClasses = 'bg-amber-50 text-amber-800 border-amber-200';
    barClasses = 'bg-amber-500';
  } else if (score < 80) {
    badgeClasses = 'bg-sky-50 text-sky-800 border-sky-200';
    barClasses = 'bg-sky-600';
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition duration-200 p-4 sm:p-5 flex flex-col justify-between space-y-4">
      {/* Top Section: Photo + Metadata + Score Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
          <img
            src={photo}
            alt={title}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-slate-100 shadow-2xs"
          />

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <StatusBadge type={reportType} size="xs" />
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md truncate">
                {category}
              </span>
              {reportType === 'FOUND' && currentLocation && (
                <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>Kept: {currentLocation}</span>
                </span>
              )}
            </div>

            <h4 className="font-bold text-sm sm:text-base text-slate-900 truncate">
              {title}
            </h4>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{area ? `${area}, ` : ''}{city}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{reportType === 'FOUND' ? 'Found' : 'Lost'}: {formattedDate}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Score Indicator Box */}
        <div className="sm:self-center shrink-0 w-full sm:w-44 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Similarity</span>
            </div>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full border ${badgeClasses}`}>
              {score}% • {label}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barClasses}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Footer & Breakdown Toggle */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition cursor-pointer"
        >
          <span>{showBreakdown ? 'Hide Match Factors' : 'View Match Factors'}</span>
          {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <Link to={`/item/${id}`} className="self-end sm:self-auto">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer shadow-2xs"
          >
            <span>View Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

      {/* Expanded Factor Breakdown */}
      {showBreakdown && (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-600 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {breakdown.category !== undefined && (
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
              <span className="font-semibold text-slate-800">+{breakdown.category} pts</span>
            </div>
          )}
          {breakdown.city !== undefined && (
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">City</span>
              <span className="font-semibold text-slate-800">+{breakdown.city} pts</span>
            </div>
          )}
          {breakdown.area !== undefined && (
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Area</span>
              <span className="font-semibold text-slate-800">+{breakdown.area} pts</span>
            </div>
          )}
          {breakdown.date !== undefined && (
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Date Proximity</span>
              <span className="font-semibold text-slate-800">+{breakdown.date} pts</span>
            </div>
          )}
          {breakdown.brand !== undefined && (
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Brand</span>
              <span className="font-semibold text-slate-800">+{breakdown.brand} pts</span>
            </div>
          )}
          {breakdown.model !== undefined && (
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Model</span>
              <span className="font-semibold text-slate-800">+{breakdown.model} pts</span>
            </div>
          )}
          {breakdown.color !== undefined && (
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Color</span>
              <span className="font-semibold text-slate-800">+{breakdown.color} pts</span>
            </div>
          )}
          {breakdown.text !== undefined && (
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Text Overlap</span>
              <span className="font-semibold text-slate-800">+{breakdown.text} pts</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchCard;
