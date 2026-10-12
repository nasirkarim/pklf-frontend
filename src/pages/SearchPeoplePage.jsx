import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Users,
  UserPlus,
  X,
  RefreshCw,
} from 'lucide-react';
import { PAKISTANI_CITIES } from '../utils/categories';
import { ROUTES } from '../utils/constants';
import missingPersonService from '../services/missingPersonService';
import MissingPersonCard from '../components/MissingPersonCard';
import Pagination from '../components/Pagination';
import Select from '../components/Select';
import Input from '../components/Input';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

export const SearchPeoplePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial query params from URL
  const initialKeyword = searchParams.get('q') || searchParams.get('search') || '';
  const initialCity = searchParams.get('city') || '';
  const initialArea = searchParams.get('area') || '';
  const initialGender = searchParams.get('gender') || 'all';
  const initialMinAge = searchParams.get('minAge') || '';
  const initialMaxAge = searchParams.get('maxAge') || '';
  const initialFromDate = searchParams.get('fromDate') || '';
  const initialToDate = searchParams.get('toDate') || '';
  const initialStatus = searchParams.get('status') || 'all';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialPage = parseInt(searchParams.get('page'), 10) || 1;

  // Filter state
  const [keyword, setKeyword] = useState(initialKeyword);
  const [city, setCity] = useState(initialCity);
  const [area, setArea] = useState(initialArea);
  const [gender, setGender] = useState(initialGender);
  const [minAge, setMinAge] = useState(initialMinAge);
  const [maxAge, setMaxAge] = useState(initialMaxAge);
  const [fromDate, setFromDate] = useState(initialFromDate);
  const [toDate, setToDate] = useState(initialToDate);
  const [status, setStatus] = useState(initialStatus);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);

  // Results state
  const [persons, setPersons] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Debouncing ref for live keyword input
  const debounceTimerRef = useRef(null);

  // Fetch search results from backend
  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit: 12,
        sort,
      };

      if (keyword.trim()) params.q = keyword.trim();
      if (city && city !== 'All Cities' && city !== 'all') params.city = city;
      if (area.trim()) params.area = area.trim();
      if (gender && gender !== 'all') params.gender = gender;
      if (minAge !== '') params.minAge = minAge;
      if (maxAge !== '') params.maxAge = maxAge;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      if (status && status !== 'all') params.status = status;

      const res = await missingPersonService.getMissingPersons(params);

      if (res?.success) {
        setPersons(res.missingPersons || []);
        setTotalCount(res.total || 0);
        setTotalPages(res.pages || 1);
      } else {
        throw new Error(res?.message || 'Failed to fetch search results');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Unable to connect to service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [keyword, city, area, gender, minAge, maxAge, fromDate, toDate, status, sort, page]);

  // Sync state to URL search parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('q', keyword.trim());
    if (city && city !== 'all' && city !== 'All Cities') params.set('city', city);
    if (area.trim()) params.set('area', area.trim());
    if (gender && gender !== 'all') params.set('gender', gender);
    if (minAge !== '') params.set('minAge', minAge);
    if (maxAge !== '') params.set('maxAge', maxAge);
    if (fromDate) params.set('fromDate', fromDate);
    if (toDate) params.set('toDate', toDate);
    if (status && status !== 'all') params.set('status', status);
    if (sort !== 'newest') params.set('sort', sort);
    if (page > 1) params.set('page', page);

    setSearchParams(params, { replace: true });
  }, [keyword, city, area, gender, minAge, maxAge, fromDate, toDate, status, sort, page, setSearchParams]);

  // Execute query on state change
  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Handle keyword typing with debouncing
  const handleKeywordChange = (e) => {
    const val = e.target.value;
    setKeyword(val);
    setPage(1);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
  };

  const handleClearFilters = () => {
    setKeyword('');
    setCity('');
    setArea('');
    setGender('all');
    setMinAge('');
    setMaxAge('');
    setFromDate('');
    setToDate('');
    setStatus('all');
    setSort('newest');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    keyword.trim() ||
      (city && city !== 'All Cities' && city !== 'all') ||
      area.trim() ||
      (gender && gender !== 'all') ||
      minAge !== '' ||
      maxAge !== '' ||
      fromDate ||
      toDate ||
      (status && status !== 'all')
  );

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Users className="w-3.5 h-3.5" />
              <span>National Directory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Find Someone
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Search publicly available missing-person reports across Pakistan. Filter by name, demographics, geographic region, and timeline.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to={ROUTES.REPORT_PERSON}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Report a Missing Person</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Search & Filters Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Search Bar Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by name, location, clothing, or identifying features..."
              value={keyword}
              onChange={handleKeywordChange}
              className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition shadow-2xs"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => {
                  setKeyword('');
                  setPage(1);
                }}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border text-sm font-semibold transition cursor-pointer shrink-0 shadow-2xs ${
              filtersOpen || hasActiveFilters
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            )}
          </button>
        </div>

        {/* Collapsible Filter Panel */}
        {filtersOpen && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            {/* City */}
            <div>
              <Select
                label="City"
                id="searchCity"
                name="searchCity"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: 'all', label: 'All Cities' },
                  ...PAKISTANI_CITIES.map((c) => ({ value: c, label: c })),
                ]}
              />
            </div>

            {/* Area */}
            <div>
              <Input
                label="Area / Neighborhood"
                id="searchArea"
                name="searchArea"
                placeholder="e.g. Saddar, Gulberg"
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Gender */}
            <div>
              <Select
                label="Gender"
                id="searchGender"
                name="searchGender"
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: 'all', label: 'All Genders' },
                  { value: 'MALE', label: 'Male' },
                  { value: 'FEMALE', label: 'Female' },
                  { value: 'OTHER', label: 'Other' },
                  { value: 'UNKNOWN', label: 'Unknown' },
                ]}
              />
            </div>

            {/* Status */}
            <div>
              <Select
                label="Case Status"
                id="searchStatus"
                name="searchStatus"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: 'all', label: 'All Cases (Active & Located)' },
                  { value: 'ACTIVE', label: 'Actively Looking' },
                  { value: 'POSSIBLE_MATCH', label: 'Possible Match Under Review' },
                  { value: 'LOCATED', label: 'Person Safely Located' },
                  { value: 'CLOSED', label: 'Case Closed' },
                ]}
              />
            </div>

            {/* Age Range */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Age Range (Years)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="150"
                  placeholder="Min"
                  value={minAge}
                  onChange={(e) => {
                    setMinAge(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-hidden focus:border-emerald-600 transition"
                />
                <span className="text-slate-400 text-xs">to</span>
                <input
                  type="number"
                  min="0"
                  max="150"
                  placeholder="Max"
                  value={maxAge}
                  onChange={(e) => {
                    setMaxAge(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-hidden focus:border-emerald-600 transition"
                />
              </div>
            </div>

            {/* Date Range: From */}
            <div>
              <Input
                label="Last Seen From"
                id="searchFromDate"
                name="searchFromDate"
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Date Range: To */}
            <div>
              <Input
                label="Last Seen To"
                id="searchToDate"
                name="searchToDate"
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Sort Order */}
            <div>
              <Select
                label="Sort Order"
                id="searchSort"
                name="searchSort"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: 'newest', label: 'Newest Inquiries First' },
                  { value: 'oldest', label: 'Oldest Inquiries First' },
                  { value: 'date_desc', label: 'Recently Last Seen' },
                  { value: 'alphabetical', label: 'Alphabetical (A-Z)' },
                ]}
              />
            </div>
          </div>
        )}

        {/* Active Filter Badges & Clear Button */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 font-medium">Active Filters:</span>
              {keyword && (
                <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                  Search: "{keyword}"
                  <button onClick={() => setKeyword('')} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {city && city !== 'all' && city !== 'All Cities' && (
                <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                  City: {city}
                  <button onClick={() => setCity('')} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {area && (
                <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                  Area: {area}
                  <button onClick={() => setArea('')} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {gender && gender !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                  Gender: {gender}
                  <button onClick={() => setGender('all')} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(minAge !== '' || maxAge !== '') && (
                <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                  Age: {minAge || 0} - {maxAge || 150} yrs
                  <button
                    onClick={() => {
                      setMinAge('');
                      setMaxAge('');
                    }}
                    className="hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 font-semibold transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 px-1">
        <div>
          Showing <span className="font-bold text-slate-800">{persons.length}</span> of{' '}
          <span className="font-bold text-slate-800">{totalCount}</span> registered missing person records
        </div>

        <button
          onClick={fetchResults}
          disabled={isLoading}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="py-20 bg-white rounded-3xl border border-slate-200">
          <Loading message="Searching missing person records..." />
        </div>
      ) : error ? (
        <ErrorState
          title="Search Failed"
          description={error}
          onRetry={fetchResults}
        />
      ) : persons.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'No Matching Person Records Found' : 'No Open Missing Person Inquiries'}
          description={
            hasActiveFilters
              ? 'Try widening your search terms, selecting a broader age range, or clearing filters.'
              : 'There are currently no active missing person cases registered in the system.'
          }
          icon={Users}
          actionLabel={hasActiveFilters ? 'Reset Filters' : 'Report a Missing Person'}
          onAction={hasActiveFilters ? handleClearFilters : null}
          actionTo={!hasActiveFilters ? ROUTES.REPORT_PERSON : null}
        />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {persons.map((person) => (
              <MissingPersonCard key={person._id || person.id} person={person} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalCount}
              itemsPerPage={12}
              onPageChange={(newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPeoplePage;
