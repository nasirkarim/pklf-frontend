import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Eye, Tag, ShieldCheck, Home } from 'lucide-react';
import StatusBadge from './StatusBadge';

export const ReportCard = ({ report }) => {
  const [imgError, setImgError] = useState(false);
  if (!report) return null;

  const id = report._id || report.id;
  const title = report.title || 'Untitled Report';
  const category = report.category || 'General';
  const city = report.foundCity || report.city || 'Pakistan';
  const area = report.foundArea || report.area || '';
  const status = report.status || 'ACTIVE';
  const type = report.type || report.reportType || 'LOST';
  const currentLocation = report.currentLocation || '';

  // Photo resolution: check photos array or image fallback
  let photo = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80';
  if (report.photos && report.photos.length > 0) {
    photo = report.photos[0];
  } else if (report.image) {
    photo = report.image;
  }

  const rawDate = type === 'FOUND'
    ? (report.foundDate || report.date || report.lostDate)
    : (report.lostDate || report.date || report.foundDate);

  const eventDateFormatted = rawDate
    ? new Date(rawDate).toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown date';

  const createdDateFormatted = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
        {imgError ? (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100 shadow-2xs">
            <Tag className="w-6 h-6 stroke-1 text-slate-400" />
          </div>
        ) : (
          <img
            src={photo}
            alt={title}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-slate-100 shadow-2xs"
            onError={() => setImgError(true)}
          />
        )}
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge type={type} size="xs" />
            <StatusBadge type={status} size="xs" />
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              {category}
            </span>
            {type === 'FOUND' && currentLocation && (
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                <span>Kept: {currentLocation}</span>
              </span>
            )}
          </div>

          <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1">
            {title}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{area ? `${area}, ` : ''}{city}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{type === 'FOUND' ? 'Found' : 'Lost'}: {eventDateFormatted}</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Reported: {createdDateFormatted}
            </span>
          </div>
        </div>
      </div>

      <div className="self-end sm:self-center shrink-0">
        <Link to={`/item/${id}`}>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>View Details</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ReportCard;
