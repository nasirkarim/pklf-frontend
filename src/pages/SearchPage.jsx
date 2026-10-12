import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  PlusCircle,
  X,
} from 'lucide-react';
import { REPORT_CATEGORIES, PAKISTANI_CITIES } from '../utils/categories';
import { ROUTES } from '../utils/constants';
import { reportService } from '../services/reportService';
import ItemCard from '../components/ItemCard';
import Pagination from '../components/Pagination';
import ActiveFilters from '../components/ActiveFilters';
import Select from '../components/Select';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial query params from URL
  const initialKeyword = searchParams.get('keyword') || searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'ALL';
  const initialCategory = searchParams.get('category') || 'all';
  const initialCity = searchParams.get('city') || '';
  const initialArea = searchParams.get('area') || '';
  const initialBrand = searchParams.get('brand') || '';
  const initialColor = searchParams.get('color') || '';
  const initialFromDate = searchParams.get('fromDate') || '';
  const initialToDate = searchParams.get('toDate') || '';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialPage = parseInt(searchParams.get('page'), 10) || 1;

  // Form filter state
  const [keyword, setKeyword] = useState(initialKeyword);
  const [type, setType] = useState(initialType);
  const [category, setCategory] = useState(initialCategory);
  const [city, setCity] = useState(initialCity);
  const [area, setArea] = useState(initialArea);
  const [brand, setBrand] = useState(initialBrand);
  const [color, setColor] = useState(initialColor);
  const [fromDate, setFromDate] = useState(initialFromDate);
  const [toDate, setToDate] = useState(initialToDate);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);

  // Response state
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [dateError, setDateError] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Lock background scroll when mobile filter drawer is open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileFilters]);

  // Debounce ref for keyword typing
  const debounceTimerRef = useRef(null);

  // Synchronize state back into URL search parameters
  const updateUrlParams = useCallback(
    (newParams) => {
      const sp = new URLSearchParams();
      if (newParams.keyword) sp.set('keyword', newParams.keyword);
      if (newParams.type && newParams.type !== 'ALL') sp.set('type', newParams.type);
      if (newParams.category && newParams.category !== 'all') sp.set('category', newParams.category);
      if (newParams.city && newParams.city !== 'All Cities') sp.set('city', newParams.city);
      if (newParams.area) sp.set('area', newParams.area);
      if (newParams.brand) sp.set('brand', newParams.brand);
      if (newParams.color) sp.set('color', newParams.color);
      if (newParams.fromDate) sp.set('fromDate', newParams.fromDate);
      if (newParams.toDate) sp.set('toDate', newParams.toDate);
      if (newParams.sort && newParams.sort !== 'newest') sp.set('sort', newParams.sort);
      if (newParams.page && newParams.page > 1) sp.set('page', String(newParams.page));

      setSearchParams(sp, { replace: true });
    },
    [setSearchParams]
  );

  // Main data fetching function
  const fetchReports = useCallback(
    async (overrideParams = {}) => {
      const activeKeyword = overrideParams.keyword !== undefined ? overrideParams.keyword : keyword;
      const activeType = overrideParams.type !== undefined ? overrideParams.type : type;
      const activeCategory = overrideParams.category !== undefined ? overrideParams.category : category;
      const activeCity = overrideParams.city !== undefined ? overrideParams.city : city;
      const activeArea = overrideParams.area !== undefined ? overrideParams.area : area;
      const activeBrand = overrideParams.brand !== undefined ? overrideParams.brand : brand;
      const activeColor = overrideParams.color !== undefined ? overrideParams.color : color;
      const activeFromDate = overrideParams.fromDate !== undefined ? overrideParams.fromDate : fromDate;
      const activeToDate = overrideParams.toDate !== undefined ? overrideParams.toDate : toDate;
      const activeSort = overrideParams.sort !== undefined ? overrideParams.sort : sort;
      const activePage = overrideParams.page !== undefined ? overrideParams.page : page;

      // Validate date range
      if (activeFromDate && activeToDate && new Date(activeFromDate) > new Date(activeToDate)) {
        setDateError('Start date cannot be after end date.');
        return;
      }
      setDateError('');

      setIsLoading(true);
      setErrorMessage('');

      try {
        const queryParams = {
          keyword: activeKeyword.trim(),
          type: activeType,
          category: activeCategory,
          city: activeCity,
          area: activeArea.trim(),
          brand: activeBrand.trim(),
          color: activeColor.trim(),
          fromDate: activeFromDate,
          toDate: activeToDate,
          sort: activeSort,
          page: activePage,
          limit: 12,
        };

        const res = await reportService.searchReports(queryParams);

        if (res?.success) {
          setReports(res.reports || []);
          setPagination(
            res.pagination || {
              page: activePage,
              limit: 12,
              total: res.count || 0,
              totalPages: 1,
            }
          );
        } else {
          throw new Error(res?.message || 'Failed to search reports');
        }

        // Update URL
        updateUrlParams(queryParams);
      } catch (err) {
        setErrorMessage(
          err.message || 'Unable to load reports. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      keyword,
      type,
      category,
      city,
      area,
      brand,
      color,
      fromDate,
      toDate,
      sort,
      page,
      updateUrlParams,
    ]
  );

  // Trigger search on filter change (with debounce on keyword)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchReports();
    }, 350);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, category, city, area, brand, color, fromDate, toDate, sort, page]);

  // Handle keyword changes with custom debounce
  const handleKeywordChange = (e) => {
    const val = e.target.value;
    setKeyword(val);
    setPage(1);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchReports({ keyword: val, page: 1 });
    }, 400);
  };

  // Type filter change
  const handleTypeChange = (newType) => {
    setType(newType);
    setPage(1);
  };

  // Clear all filters
  const handleClearAll = () => {
    setKeyword('');
    setType('ALL');
    setCategory('all');
    setCity('');
    setArea('');
    setBrand('');
    setColor('');
    setFromDate('');
    setToDate('');
    setSort('newest');
    setPage(1);
    setDateError('');

    fetchReports({
      keyword: '',
      type: 'ALL',
      category: 'all',
      city: '',
      area: '',
      brand: '',
      color: '',
      fromDate: '',
      toDate: '',
      sort: 'newest',
      page: 1,
    });
  };

  // Remove individual filter chip
  const handleRemoveFilter = (filterKey) => {
    const updates = { page: 1 };
    setPage(1);

    switch (filterKey) {
      case 'keyword':
        setKeyword('');
        updates.keyword = '';
        break;
      case 'type':
        setType('ALL');
        updates.type = 'ALL';
        break;
      case 'category':
        setCategory('all');
        updates.category = 'all';
        break;
      case 'city':
        setCity('');
        updates.city = '';
        break;
      case 'area':
        setArea('');
        updates.area = '';
        break;
      case 'brand':
        setBrand('');
        updates.brand = '';
        break;
      case 'color':
        setColor('');
        updates.color = '';
        break;
      case 'fromDate':
        setFromDate('');
        updates.fromDate = '';
        break;
      case 'toDate':
        setToDate('');
        updates.toDate = '';
        break;
      default:
        break;
    }

    fetchReports(updates);
  };

  // Count active non-default filters
  const activeFiltersCount = [
    keyword.trim(),
    type !== 'ALL',
    category !== 'all',
    city && city !== 'All Cities',
    area.trim(),
    brand.trim(),
    color.trim(),
    fromDate,
    toDate,
  ].filter(Boolean).length;

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              National Directory
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              Find Lost &amp; Found Items
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Search reported lost and found items across Pakistan.
            </p>
          </div>

          {/* Quick CTA to report item */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <Link to={ROUTES.REPORT_LOST}>
              <Button variant="danger" size="sm" icon={HelpCircle}>
                + Report Lost
              </Button>
            </Link>
            <Link to={ROUTES.REPORT_FOUND}>
              <Button variant="primary" size="sm" icon={PlusCircle}>
                + Report Found
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={keyword}
              onChange={handleKeywordChange}
              placeholder="Search by item name, brand, color, description, or keywords..."
              className="w-full pl-11 pr-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition shadow-2xs"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => {
                  setKeyword('');
                  fetchReports({ keyword: '', page: 1 });
                }}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition"
                title="Clear keyword"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="lg:hidden flex-1"
              icon={SlidersHorizontal}
              onClick={() => setShowMobileFilters(true)}
            >
              Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
            </Button>

            <Button
              variant="primary"
              onClick={() => fetchReports({ page: 1 })}
              className="px-6"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Report Type Filter Tabs (ALL / LOST / FOUND) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-2">
            Report Type:
          </span>
          {[
            { id: 'ALL', label: 'All Items' },
            { id: 'LOST', label: '🔴 Lost Items' },
            { id: 'FOUND', label: '🟢 Found Items' },
          ].map((itemType) => (
            <button
              key={itemType.id}
              type="button"
              onClick={() => handleTypeChange(itemType.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                type === itemType.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {itemType.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Chips */}
      <ActiveFilters
        filters={{
          keyword,
          type,
          category,
          city,
          area,
          brand,
          color,
          fromDate,
          toDate,
        }}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
      />

      {/* Date Validation Error Banner */}
      {dateError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{dateError}</span>
        </div>
      )}

      {/* Mobile Filters Slide-Over Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowMobileFilters(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search Filters"
            className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10"
          >
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-800" />
                <h2 className="font-bold text-base text-slate-900">Filters</h2>
                {activeFiltersCount > 0 && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                aria-label="Close filters drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <Select
                label="Category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: 'all', label: 'All Categories' },
                  ...REPORT_CATEGORIES.map((c) => ({ value: c, label: c })),
                ]}
              />

              <Select
                label="City"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: '', label: 'All Cities' },
                  ...PAKISTANI_CITIES.map((c) => ({ value: c, label: c })),
                ]}
              />

              <Input
                label="Area / Neighborhood"
                placeholder="e.g. Saddar, Gulshan, F-7"
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  setPage(1);
                }}
                helperText="Supports partial matching"
              />

              <Input
                label="Brand / Manufacturer"
                placeholder="e.g. Samsung, Apple, Honda"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setPage(1);
                }}
              />

              <Input
                label="Color"
                placeholder="e.g. Black, Silver, Blue"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  setPage(1);
                }}
              />

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Date Range
                </span>
                <div className="space-y-2">
                  <Input
                    label="From Date"
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setPage(1);
                    }}
                  />
                  <Input
                    label="To Date"
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleClearAll}
                icon={RotateCcw}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setShowMobileFilters(false);
                  fetchReports({ page: 1 });
                }}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Sidebar Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar (Desktop) */}
        <aside className="hidden lg:block bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-800" />
              <h2 className="font-bold text-sm text-slate-900">Filters</h2>
              {activeFiltersCount > 0 && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <Select
            label="Category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            options={[
              { value: 'all', label: 'All Categories' },
              ...REPORT_CATEGORIES.map((c) => ({ value: c, label: c })),
            ]}
          />

          {/* City Filter */}
          <Select
            label="City"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setPage(1);
            }}
            options={[
              { value: '', label: 'All Cities' },
              ...PAKISTANI_CITIES.map((c) => ({ value: c, label: c })),
            ]}
          />

          {/* Area / Neighborhood Filter */}
          <Input
            label="Area / Neighborhood"
            placeholder="e.g. Saddar, Gulshan, F-7"
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
              setPage(1);
            }}
            helperText="Supports partial matching"
          />

          {/* Brand Filter */}
          <Input
            label="Brand / Manufacturer"
            placeholder="e.g. Samsung, Apple, Honda"
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              setPage(1);
            }}
          />

          {/* Color Filter */}
          <Input
            label="Color"
            placeholder="e.g. Black, Silver, Blue"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              setPage(1);
            }}
          />

          {/* Date Range Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Date Range
            </span>
            <div className="space-y-2">
              <Input
                label="From Date"
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
              />
              <Input
                label="To Date"
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={handleClearAll}
              icon={RotateCcw}
            >
              Clear All Filters
            </Button>
          </div>
        </aside>

        {/* Results Area */}
        <section className="lg:col-span-3 space-y-6">
          {/* Results Toolbar: Count & Sort */}
          <div className="bg-white rounded-2xl border border-slate-200 px-5 py-3.5 shadow-2xs flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs sm:text-sm text-slate-600">
              {isLoading ? (
                <span>Searching reports...</span>
              ) : pagination.total === 0 ? (
                <span className="font-semibold text-slate-700">No reports found</span>
              ) : (
                <span>
                  Showing <span className="font-bold text-slate-900">{pagination.total}</span>{' '}
                  {pagination.total === 1 ? 'report' : 'reports'} found
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Sort:
              </span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="recently_updated">Recently Updated</option>
              </select>
            </div>
          </div>

          {/* Results Display */}
          {isLoading ? (
            <Loading message="Searching reports..." />
          ) : errorMessage ? (
            <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Unable to load reports.
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Please check your network connection and try again.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => fetchReports()}
                icon={RefreshCw}
              >
                Try Again
              </Button>
            </div>
          ) : reports.length === 0 ? (
            <EmptyState
              title="No matching reports found"
              description="We couldn't find any lost or found items matching your search. Try changing your filters or search terms."
              actionLabel="Clear Filters"
              onAction={handleClearAll}
              icon={Search}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {reports.map((report) => (
                  <ItemCard key={report._id || report.id} item={report} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
                onPageChange={(newPage) => {
                  setPage(newPage);
                  fetchReports({ page: newPage });
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default SearchPage;
