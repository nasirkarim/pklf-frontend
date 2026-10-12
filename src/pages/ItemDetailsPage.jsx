import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ShieldCheck,
  Eye,
  FileCheck,
  Share2,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import { matchingService } from '../services/matchingService';
import StatusBadge from '../components/StatusBadge';
import MatchCard from '../components/MatchCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

export const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [realReport, setRealReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Smart Matching states
  const [matches, setMatches] = useState([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [matchesError, setMatchesError] = useState('');

  // Fetch report details
  useEffect(() => {
    let isMounted = true;
    const fetchReport = async () => {
      setIsLoading(true);
      try {
        const res = await reportService.getReportById(id);
        if (res?.success && res?.report && isMounted) {
          setRealReport(res.report);
        }
      } catch {
        // Fallback to mock data if it's a mock report or not in DB
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchReport();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Fetch smart matching suggestions
  const fetchMatches = useCallback(async () => {
    setIsLoadingMatches(true);
    setMatchesError('');
    try {
      const res = await matchingService.getReportMatches(id);
      if (res?.success) {
        setMatches(res.matches || []);
      }
    } catch (err) {
      setMatchesError(err.message || 'Unable to load possible matches right now');
    } finally {
      setIsLoadingMatches(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const item = realReport || {};

  // Resolve photo array
  const photosList =
    item.photos && item.photos.length > 0
      ? item.photos
      : item.images && item.images.length > 0
      ? item.images
      : item.image
      ? [item.image]
      : ['https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'];

  const mainPhoto = photosList[selectedImageIndex] || photosList[0];

  const eventDate =
    item.type === 'FOUND'
      ? item.foundDate || item.date || item.lostDate
      : item.lostDate || item.date || item.foundDate;

  const formattedEventDate = eventDate
    ? new Date(eventDate).toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown date';

  const formattedReportDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recently';

  const reportId = item._id || item.id;
  const reportType = item.type || item.reportType || 'LOST';
  const reportStatus = item.status || 'ACTIVE';
  const displayCity = item.foundCity || item.city || 'Pakistan';
  const displayArea = item.foundArea || item.area || '';
  const displayTime = reportType === 'FOUND' ? (item.foundTime || item.lostTime) : (item.lostTime || item.foundTime);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading) {
    return <Loading message="Loading item report details..." fullHeight />;
  }

  if (!realReport) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Report Not Found</h2>
        <p className="text-xs text-slate-500">
          This report does not exist or may have been removed from the registry.
        </p>
        <div className="pt-2">
          <Link to={ROUTES.SEARCH}>
            <Button variant="primary" size="sm">
              Back to Search
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const finderId = item.user?._id || item.user;
  const isFinder = Boolean(user && finderId && String(user._id || user.id) === String(finderId));
  const isReportActive = reportStatus === 'ACTIVE';

  const handleClaimClick = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }
    navigate(`/claim/${reportId}`);
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Navigation Breadcrumb / Back button */}
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.SEARCH}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Reports</span>
        </Link>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Link Copied!' : 'Share Report'}</span>
        </button>
      </div>

      {/* Main Item Detail Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Photos Gallery */}
          <div className="bg-slate-100 p-4 sm:p-6 flex flex-col justify-between space-y-4">
            <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden bg-slate-900/5 shadow-2xs">
              <img
                src={mainPhoto}
                alt={item.title}
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                <StatusBadge type={reportType} size="lg" />
                <StatusBadge type={reportStatus} size="lg" />
              </div>
            </div>

            {/* Thumbnail carousel if multiple photos */}
            {photosList.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {photosList.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-emerald-600 ring-2 ring-emerald-200'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Overview & Metadata */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & ID badge */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {item.category?.replace('_', ' ').toUpperCase()}
                  {item.subCategory ? ` • ${item.subCategory}` : ''}
                </span>
                <span className="font-mono text-slate-400">
                  ID: {reportId ? String(reportId).slice(-8) : 'REPORT'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {item.title}
              </h1>

              {/* Location & Dates */}
              <div className="mt-4 space-y-2 text-xs sm:text-sm text-slate-600 border-y border-slate-100 py-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-medium text-slate-900">Location:</span>
                  <span>{displayArea ? `${displayArea}, ` : ''}{displayCity}</span>
                </div>
                {item.locationDescription && (
                  <div className="text-xs text-slate-500 pl-6">
                    {item.locationDescription}
                  </div>
                )}
                {item.foundLocationDescription && item.foundLocationDescription !== item.locationDescription && (
                  <div className="text-xs text-slate-500 pl-6">
                    {item.foundLocationDescription}
                  </div>
                )}
                {item.location && typeof item.location === 'string' && (
                  <div className="text-xs text-slate-500 pl-6">
                    {item.location}
                  </div>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-medium text-slate-900">
                    {reportType === 'LOST' ? 'Lost on:' : 'Found on:'}
                  </span>
                  <span>{formattedEventDate}</span>
                  {displayTime && (
                    <span className="text-slate-400">({displayTime})</span>
                  )}
                </div>
                {reportType === 'FOUND' && item.currentLocation && (
                  <div className="flex items-start gap-2 pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900">Kept at: </span>
                      <span>{item.currentLocation}</span>
                      {item.currentKeepingDescription && (
                        <p className="text-xs text-slate-500 mt-0.5">{item.currentKeepingDescription}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Item Specs Table */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-medium">Brand</span>
                  <span className="font-semibold text-slate-800">{item.brand || 'Unspecified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Model</span>
                  <span className="font-semibold text-slate-800">{item.model || 'Unspecified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Color</span>
                  <span className="font-semibold text-slate-800">{item.color || 'Unspecified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Report Date</span>
                  <span className="font-semibold text-slate-800">{formattedReportDate}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {reportType === 'FOUND' ? (
                isFinder ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-xs text-slate-600 font-medium">
                    You reported this item as found.
                  </div>
                ) : !isReportActive ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center text-xs text-amber-800 font-medium">
                    This item is no longer available for new claims ({reportStatus}).
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    icon={FileCheck}
                    onClick={handleClaimClick}
                  >
                    This Is My Item — Claim Ownership
                  </Button>
                )
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={FileCheck}
                  onClick={() => setClaimModalOpen(true)}
                >
                  I Have Found This Item — Contact Owner
                </Button>
              )}

              <Button
                variant="outline"
                size="md"
                fullWidth
                icon={Eye}
                onClick={() => setClaimModalOpen(true)}
              >
                View Verification &amp; Claim Protocol
              </Button>
            </div>
          </div>
        </div>

        {/* Detailed Description & Identifying Marks Section */}
        <div className="p-6 sm:p-8 border-t border-slate-200 bg-slate-50/50 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">Item Description</h2>
            <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
              {item.description}
            </p>
          </div>

          {(item.identifyingFeatures || item.identifyingMarks) && (
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                Identifying Features &amp; Marks
              </h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-900">
                {item.identifyingFeatures || item.identifyingMarks}
              </div>
            </div>
          )}

          {/* Safety Warning Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950">
              <span className="font-bold">Pakistan Community Safety Notice:</span>
              <p className="mt-0.5 text-emerald-900">
                Never pay upfront recovery fees without physically inspecting items. For handovers, choose well-lit public venues such as a local police station or shopping mall.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Possible Matches Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Possible Matches
              </h2>
              {matches.length > 0 && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {matches.length} {matches.length === 1 ? 'Match' : 'Matches'} Found
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Automated suggestions based on opposite report similarity. These are not confirmed matches.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchMatches}
            title="Refresh matching engine"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-evaluate</span>
          </button>
        </div>

        {/* Matches Content */}
        {isLoadingMatches ? (
          <div className="py-8">
            <Loading message="Finding possible matches..." />
          </div>
        ) : matchesError ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
            <p className="text-xs text-rose-800 font-medium">{matchesError}</p>
            <button
              type="button"
              onClick={fetchMatches}
              className="text-xs font-bold text-rose-700 underline hover:text-rose-900 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">
              No Possible Matches Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn&apos;t find a strong match for this report right now. New reports may create a possible match later.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((matchItem) => (
              <MatchCard
                key={matchItem.report._id || matchItem.report.id}
                matchItem={matchItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Claim Process Modal */}
      <Modal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        title="Claim &amp; Recovery Workflow"
        subtitle={`Report: ${item.title}`}
      >
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
            <p className="font-bold text-slate-900 text-sm">
              Safe Recovery Protocol:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
              <li>Ownership proof must be submitted through the upcoming claim portal.</li>
              <li>The finder or guardian evaluates purchase receipts or matching distinctive marks.</li>
              <li>Handover coordination will unlock safely in a public Pakistani venue.</li>
            </ol>
          </div>

          <div className="border border-emerald-200 bg-emerald-50/60 rounded-xl p-3 text-center">
            <span className="text-xs font-bold text-emerald-800 block">
              Verified Claim Protection
            </span>
            <p className="text-xs text-emerald-700 mt-0.5">
              Claim evidence is securely verified by the finder. False claims or fraudulent attempts are flagged and investigated.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setClaimModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ItemDetailsPage;
