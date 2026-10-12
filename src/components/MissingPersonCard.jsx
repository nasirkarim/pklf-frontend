import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, User, ArrowRight, Shield } from 'lucide-react';
import StatusBadge from './StatusBadge';

export const MissingPersonCard = ({ person }) => {
  const [imgError, setImgError] = useState(false);
  if (!person) return null;

  const id = person._id || person.id;
  const name = person.name || 'Unidentified Person';
  const age = person.age;
  const gender = person.gender || 'UNKNOWN';
  const city = person.lastSeenCity || 'Pakistan';
  const area = person.lastSeenArea || '';
  const status = person.status || 'ACTIVE';
  const features = person.identifyingFeatures || person.clothingDescription || '';

  const formattedDate = person.lastSeenDate
    ? new Date(person.lastSeenDate).toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Date not specified';

  const photo =
    person.photo ||
    (person.photos && person.photos.length > 0 ? person.photos[0] : null);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg hover:border-slate-300 transition duration-200 flex flex-col h-full">
      {/* Photo Container */}
      <div className="relative h-56 w-full bg-slate-100 overflow-hidden shrink-0">
        {photo && !imgError ? (
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <User className="w-16 h-16 stroke-1 text-slate-400" />
            <span className="text-[11px] font-medium text-slate-400 mt-1">
              No Photo Available
            </span>
          </div>
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <StatusBadge type={status} size="xs" />
          <span className="bg-white/90 backdrop-blur-xs text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
            {gender}
          </span>
        </div>

        {/* City tag on bottom right of photo */}
        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-0.5 rounded-lg">
          {city}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-3.5">
        <div className="space-y-2">
          {/* Name & Demographics */}
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition">
              {name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {age !== null && age !== undefined ? `${age} years old` : 'Age not specified'}
              {' • '}
              <span className="capitalize">{gender.toLowerCase()}</span>
            </p>
          </div>

          {/* Location & Date */}
          <div className="space-y-1 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="line-clamp-1">
                {area ? `${area}, ` : ''}{city}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Last seen: {formattedDate}</span>
            </div>
          </div>

          {/* Features Snippet */}
          {features && (
            <p className="text-xs text-slate-500 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700">Notes: </span>
              {features}
            </p>
          )}
        </div>

        {/* Card Footer Link */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-600" />
            Registered Case File
          </span>
          <Link
            to={`/find-and-reunite/person/${id}`}
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

export default MissingPersonCard;
