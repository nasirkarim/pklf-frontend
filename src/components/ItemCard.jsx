import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, ArrowRight, ShieldCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';

export const ItemCard = ({ item }) => {
  const [imgError, setImgError] = useState(false);
  if (!item) return null;

  const id = item._id || item.id;
  const reportType = item.type || item.reportType || 'LOST';
  const title = item.title || 'Untitled Report';
  const category = item.category || 'General';
  const city = item.foundCity || item.city || 'Pakistan';
  const area = item.foundArea || item.area || '';
  const description = item.description || '';
  const status = item.status || 'ACTIVE';
  const currentLocation = item.currentLocation || '';
  const brand = item.brand || '';
  const color = item.color || '';

  const rawDate = reportType === 'FOUND'
    ? (item.foundDate || item.date || item.lostDate)
    : (item.lostDate || item.date || item.foundDate);

  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recently';

  // Photo resolution: first photo from photos array or image fallback
  let image = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80';
  if (item.photos && item.photos.length > 0) {
    image = item.photos[0];
  } else if (item.image) {
    image = item.image;
  } else if (item.images && item.images.length > 0) {
    image = item.images[0];
  }

  const categoryLabel = category
    ? category.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'General';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg hover:border-slate-300 transition duration-200 flex flex-col h-full">
      {/* Image Container with Badges */}
      <div className="relative h-48 sm:h-52 w-full bg-slate-100 overflow-hidden shrink-0">
        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <Tag className="w-10 h-10 stroke-1 text-slate-400 mb-1" />
            <span className="text-[11px] font-medium text-slate-400">No Image Available</span>
          </div>
        ) : (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <StatusBadge type={reportType} size="xs" />
          {status && (
            <StatusBadge type={status} size="xs" />
          )}
        </div>

        {reportType === 'FOUND' && currentLocation && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Custody: {currentLocation}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Meta badges: Category & City */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5 gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md truncate">
              <Tag className="w-3 h-3 shrink-0" />
              <span className="truncate">{categoryLabel}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500 truncate text-[11px]">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{area ? `${area}, ${city}` : city}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-emerald-800 transition line-clamp-1 mb-1.5">
            {title}
          </h3>

          {/* Brand & Color tags if available */}
          {(brand || color) && (
            <div className="flex flex-wrap gap-1.5 mb-2 text-[11px] text-slate-500">
              {brand && (
                <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-medium">
                  {brand}
                </span>
              )}
              {color && (
                <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-medium">
                  {color}
                </span>
              )}
            </div>
          )}

          {/* Description snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {description}
          </p>
        </div>

        {/* Bottom meta & CTA button */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{reportType === 'FOUND' ? 'Found' : 'Lost'}: {formattedDate}</span>
          </div>

          <Link
            to={`/item/${id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition group-hover:translate-x-0.5"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
