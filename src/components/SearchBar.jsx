import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { MAJOR_CITIES_PAKISTAN } from '../utils/constants';

export const SearchBar = ({
  initialQuery = '',
  initialCity = '',
  onSearch,
  compact = false,
  className = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(initialCity === 'All Cities' ? '' : initialCity);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ query: query.trim(), city });
    } else {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (city && city !== 'All Cities') params.set('city', city);
      navigate(`/search?${params.toString()}`);
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className={`
        bg-white rounded-2xl border border-slate-200 shadow-md p-2 flex flex-col md:flex-row gap-2 items-center
        ${compact ? 'p-1.5 shadow-xs' : 'p-2 sm:p-2.5 shadow-lg'}
        ${className}
      `}
    >
      {/* Search keyword input */}
      <div className="relative flex-1 w-full flex items-center">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lost or found items (e.g., iPhone 13, CNIC, Wallet)..."
          className="w-full pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-hidden focus:bg-slate-50 transition"
        />
      </div>

      {/* City selector divider */}
      <div className="hidden md:block w-px h-8 bg-slate-200"></div>

      {/* City dropdown */}
      <div className="relative w-full md:w-56 shrink-0 flex items-center">
        <MapPin className="w-4 h-4 text-emerald-700 absolute left-3.5 pointer-events-none" />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full appearance-none pl-10 pr-8 py-3 text-sm text-slate-700 bg-transparent rounded-xl focus:outline-hidden focus:bg-slate-50 cursor-pointer transition"
        >
          {MAJOR_CITIES_PAKISTAN.map((c) => (
            <option key={c} value={c === 'All Cities' ? '' : c}>
              {c}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 text-xs text-slate-400">▼</span>
      </div>

      {/* Search Submit Button */}
      <button
        type="submit"
        className="w-full md:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition shrink-0 cursor-pointer shadow-xs"
      >
        <span>Search</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};

export default SearchBar;
