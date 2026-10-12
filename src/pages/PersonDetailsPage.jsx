import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Shield,
  AlertCircle,
  CheckCircle2,
  Share2,
  HeartHandshake,
  MessageSquare,
  Sparkles,
  PhoneCall,
  Lock,
  ChevronRight,
  History,
  Archive,
  RefreshCw,
  Check,
} from 'lucide-react';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import missingPersonService from '../services/missingPersonService';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';

export const PersonDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Authorization flags
  const [isAuthorizedReporter, setIsAuthorizedReporter] = useState(false);
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);

  // Status transition state
  const [locatedModalOpen, setLocatedModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [statusNotes, setStatusNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusActionError, setStatusActionError] = useState('');
  const [statusActionSuccess, setStatusActionSuccess] = useState('');

  // Match Review state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedMatchToReview, setSelectedMatchToReview] = useState(null);
  const [reviewDecision, setReviewDecision] = useState('CONFIRMED');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Match / Lead submission modal state
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchReason, setMatchReason] = useState('');
  const [sightingLocation, setSightingLocation] = useState('');
  const [sightingDate, setSightingDate] = useState('');
  const [matchedPersonId, setMatchedPersonId] = useState('');
  const [isSubmittingMatch, setIsSubmittingMatch] = useState(false);
  const [matchSubmitError, setMatchSubmitError] = useState('');
  const [matchSubmitSuccess, setMatchSubmitSuccess] = useState(false);

  // Existing matches and deterministic candidate suggestions
  const [existingMatches, setExistingMatches] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  const fetchPersonData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await missingPersonService.getMissingPersonById(id);
      if (res?.success && res?.missingPerson) {
        setPerson(res.missingPerson);
        setIsAuthorizedReporter(Boolean(res.isReporter));
        setIsPlatformAdmin(Boolean(res.isAdmin || user?.role === 'admin'));
      } else {
        throw new Error(res?.message || 'Missing person case record not found');
      }
    } catch (err) {
      console.error('Fetch person error:', err);
      setError(err.message || 'Unable to load person details');
    } finally {
      setIsLoading(false);
    }
  }, [id, user]);

  const fetchMatchesAndCandidates = useCallback(async () => {
    setIsLoadingMatches(true);
    try {
      const [matchesRes, candidatesRes] = await Promise.all([
        missingPersonService.getPersonMatches(id).catch(() => ({ matches: [] })),
        missingPersonService.getCandidateMatches(id).catch(() => ({ candidates: [] })),
      ]);
      if (matchesRes?.matches) setExistingMatches(matchesRes.matches);
      if (candidatesRes?.candidates) setCandidates(candidatesRes.candidates);
    } catch (err) {
      console.error('Error fetching matches/candidates:', err);
    } finally {
      setIsLoadingMatches(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPersonData();
    fetchMatchesAndCandidates();
  }, [fetchPersonData, fetchMatchesAndCandidates]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenMatchModal = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }
    setMatchModalOpen(true);
    setMatchSubmitError('');
    setMatchSubmitSuccess(false);
  };

  const handleSubmitMatch = async (e) => {
    e.preventDefault();
    setMatchSubmitError('');

    if (!matchReason.trim()) {
      setMatchSubmitError('Please provide details or context for this possible match');
      return;
    }

    if (matchReason.trim().length < 5) {
      setMatchSubmitError('Details must be at least 5 characters long');
      return;
    }

    if (matchedPersonId && matchedPersonId.trim() === id) {
      setMatchSubmitError('A case record cannot be matched against itself');
      return;
    }

    setIsSubmittingMatch(true);

    try {
      const payload = {
        reason: matchReason.trim(),
        sightingLocation: sightingLocation.trim() || undefined,
        sightingDate: sightingDate || undefined,
        matchedPersonId: matchedPersonId.trim() || undefined,
      };

      const res = await missingPersonService.createPersonMatch(id, payload);

      if (res?.success) {
        setMatchSubmitSuccess(true);
        setMatchReason('');
        setSightingLocation('');
        setSightingDate('');
        setMatchedPersonId('');
        fetchMatchesAndCandidates();
      } else {
        throw new Error(res?.message || 'Failed to submit possible match lead');
      }
    } catch (err) {
      setMatchSubmitError(err.message || 'Error submitting possible match. Please try again.');
    } finally {
      setIsSubmittingMatch(false);
    }
  };

  const handleUpdateStatus = async (targetStatus) => {
    setIsUpdatingStatus(true);
    setStatusActionError('');
    setStatusActionSuccess('');
    try {
      const res = await missingPersonService.updatePersonStatus(id, {
        status: targetStatus,
        verificationNotes: statusNotes.trim() || undefined,
      });

      if (res?.success) {
        setStatusActionSuccess(`Case successfully updated to ${targetStatus}`);
        setLocatedModalOpen(false);
        setCloseModalOpen(false);
        setReopenModalOpen(false);
        setStatusNotes('');
        await fetchPersonData();
        await fetchMatchesAndCandidates();
      } else {
        throw new Error(res?.message || 'Failed to update case status');
      }
    } catch (err) {
      setStatusActionError(err.message || 'Error updating status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleReviewMatch = async (e) => {
    e.preventDefault();
    if (!selectedMatchToReview || !reviewDecision) return;

    setIsSubmittingReview(true);
    setReviewError('');
    try {
      const res = await missingPersonService.reviewMatch(
        selectedMatchToReview._id || selectedMatchToReview.id,
        {
          status: reviewDecision,
          decisionNotes: decisionNotes.trim() || undefined,
        }
      );

      if (res?.success) {
        setReviewModalOpen(false);
        setSelectedMatchToReview(null);
        setDecisionNotes('');
        await fetchMatchesAndCandidates();
        await fetchPersonData();
      } else {
        throw new Error(res?.message || 'Failed to submit review decision');
      }
    } catch (err) {
      setReviewError(err.message || 'Error reviewing match lead');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 max-w-4xl mx-auto">
        <Loading message="Loading missing person case file..." />
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="py-12 max-w-4xl mx-auto">
        <ErrorState
          title="Case Record Not Found"
          description={error || 'The requested missing person inquiry could not be located or has been archived.'}
          onRetry={fetchPersonData}
        />
        <div className="text-center mt-6">
          <Link to={ROUTES.FIND_REUNITE_SEARCH} className="text-sm font-semibold text-emerald-700 hover:underline">
            ← Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  const photos = person.photos && person.photos.length > 0 ? person.photos : (person.photo ? [person.photo] : []);
  const formattedLastSeenDate = person.lastSeenDate
    ? new Date(person.lastSeenDate).toLocaleDateString('en-PK', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Date not specified';

  const caseRef = (person._id || person.id || '').substring(0, 10).toUpperCase();

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Navigation & Actions Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to={ROUTES.FIND_REUNITE_SEARCH}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Case'}</span>
          </button>
        </div>
      </div>

      {/* Public Resolution Status Banner */}
      {person.status === 'LOCATED' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 text-emerald-950 flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-emerald-900">
              Person Safely Located &amp; Accounted For
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
              This missing person case has been successfully resolved and the individual is safely accounted for. Public inquiries for this case have concluded.
            </p>
          </div>
        </div>
      )}

      {person.status === 'CLOSED' && (
        <div className="bg-slate-100 border border-slate-300 rounded-2xl p-5 sm:p-6 text-slate-800 flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
            <Archive className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-slate-900">
              Case Record Concluded &amp; Archived
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              This inquiry has been officially concluded and archived. Historical records are preserved for administrative integrity.
            </p>
          </div>
        </div>
      )}

      {/* Authorized Case Management Console */}
      {(isAuthorizedReporter || isPlatformAdmin) && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  {isPlatformAdmin ? 'Administrator Case Console' : 'Reporter Case Management'}
                </span>
                <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700">
                  Current Status: {person.status}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">Case Authorization &amp; Verification</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isPlatformAdmin
                  ? 'Administrative rights to verify leads, update case lifecycle status, or close/reopen inquiries.'
                  : 'As the registered reporter of this case, you can mark the person as located or close the inquiry when resolved.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(person.status === 'ACTIVE' || person.status === 'POSSIBLE_MATCH') && (
                <Button
                  variant="primary"
                  size="md"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  onClick={() => {
                    setStatusNotes('');
                    setStatusActionError('');
                    setLocatedModalOpen(true);
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark Person as Located
                </Button>
              )}

              {person.status === 'LOCATED' && (
                <Button
                  variant="secondary"
                  size="md"
                  className="bg-slate-700 hover:bg-slate-600 text-white font-bold"
                  onClick={() => {
                    setStatusNotes('');
                    setStatusActionError('');
                    setCloseModalOpen(true);
                  }}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Conclude &amp; Close Case
                </Button>
              )}

              {isPlatformAdmin && (person.status === 'LOCATED' || person.status === 'CLOSED') && (
                <Button
                  variant="outline"
                  size="md"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  onClick={() => {
                    setStatusNotes('');
                    setStatusActionError('');
                    setReopenModalOpen(true);
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reopen Case to Active
                </Button>
              )}
            </div>
          </div>

          {statusActionSuccess && (
            <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 p-3.5 rounded-2xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusActionSuccess}</span>
            </div>
          )}

          {/* Internal Verification Notes (Private) */}
          {person.verificationNotes && (
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 text-xs space-y-1">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] block">
                Internal Verification Notes (Private):
              </span>
              <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{person.verificationNotes}</p>
            </div>
          )}

          {/* Audit History Timeline */}
          {person.history && person.history.length > 0 && (
            <div className="space-y-3 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <History className="w-4 h-4 text-slate-400" />
                Case History &amp; Audit Trail
              </span>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {person.history.map((h, i) => (
                  <div
                    key={i}
                    className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                      <span className="font-semibold text-slate-200">{h.action.replace(/_/g, ' ')}</span>
                      <span className="text-slate-400">• {h.actorName || 'Authorized User'}</span>
                      {h.note && <span className="text-slate-300 italic">"{h.note}"</span>}
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {new Date(h.timestamp).toLocaleDateString('en-PK', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Case File Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Photo Gallery Column (5 cols) */}
          <div className="md:col-span-5 bg-slate-100 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div className="w-full relative rounded-2xl overflow-hidden aspect-4/5 bg-slate-200 flex items-center justify-center shadow-inner">
              {photos.length > 0 ? (
                <img
                  src={photos[selectedPhotoIndex] || photos[0]}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                  <User className="w-20 h-20 stroke-1 mb-2" />
                  <span className="text-xs font-medium">No Photograph Provided</span>
                </div>
              )}

              {/* Status Badge Overlay */}
              <div className="absolute top-3 left-3">
                <StatusBadge type={person.status || 'ACTIVE'} size="md" />
              </div>
            </div>

            {/* Thumbnail Selectors if multiple photos */}
            {photos.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto max-w-full pb-1">
                {photos.map((ph, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      selectedPhotoIndex === idx
                        ? 'border-emerald-600 scale-105'
                        : 'border-slate-300 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={ph} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Public Safety Assurance Tag */}
            <div className="w-full mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Verified Community Case Ref: <strong>{caseRef}</strong></span>
            </div>
          </div>

          {/* Details Column (7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Header Details */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Missing Person Inquiry
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-mono text-slate-500">Case #{caseRef}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {person.name}
                </h1>
              </div>

              {/* Key Vital Facts Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Age</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {person.age !== null && person.age !== undefined ? `${person.age} years old` : 'Unspecified'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Gender</span>
                  <span className="font-bold text-slate-800 text-sm capitalize">
                    {person.gender ? person.gender.toLowerCase() : 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Last Seen City</span>
                  <span className="font-bold text-slate-800 text-sm flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    {person.lastSeenCity}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Area / Landmark</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {person.lastSeenArea || 'Unspecified area'}
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200/60">
                  <span className="text-slate-400 font-medium block">Last Seen Date &amp; Time</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {formattedLastSeenDate}
                    {person.lastSeenTime ? ` at ${person.lastSeenTime}` : ''}
                  </span>
                </div>
              </div>

              {/* Physical Description & Clothing */}
              <div className="space-y-4 text-xs sm:text-sm">
                {person.clothingDescription && (
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                      Clothing Last Seen In
                    </h3>
                    <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                      {person.clothingDescription}
                    </p>
                  </div>
                )}

                {person.identifyingFeatures && (
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                      Distinguishing Features / Physical Marks
                    </h3>
                    <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                      {person.identifyingFeatures}
                    </p>
                  </div>
                )}

                {person.additionalInformation && (
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                      Additional Background / Circumstances
                    </h3>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {person.additionalInformation}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Reporter contact protected by privacy protocol</span>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleOpenMatchModal}
                className="w-full sm:w-auto shadow-md"
              >
                <HeartHandshake className="w-4 h-4 mr-2" />
                I Have Information / Possible Match
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Law Enforcement Protocol Notice */}
      <div className="bg-rose-50 border-l-4 border-rose-600 rounded-2xl p-5 text-xs text-rose-950 flex items-start gap-3">
        <PhoneCall className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block text-sm">Emergency Verification &amp; Helplines:</span>
          <span>
            If this person is in immediate distress or requires urgent rescue, contact <strong>Police 15</strong> or <strong>Edhi 115</strong> right away. All leads submitted through this platform undergo administrative review before family notification.
          </span>
        </div>
      </div>

      {/* Section: Possible Matches & Community Leads */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-700" />
              <span>Possible Matches &amp; Sighting Leads</span>
            </h2>
            <p className="text-xs text-slate-500">
              Community leads flagged for comparison — clearly marked as <em>Possible Match — Requires Verification</em>.
            </p>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
            {isLoadingMatches ? 'Checking...' : `${existingMatches.length} Leads`}
          </span>
        </div>

        {existingMatches.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500 space-y-2">
            <p>No community match leads have been submitted for this case yet.</p>
            <Button variant="outline" size="sm" onClick={handleOpenMatchModal}>
              Submit First Sighting / Lead
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {existingMatches.map((m) => (
              <div
                key={m._id || m.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  {m.status === 'CONFIRMED' ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                      Confirmed Match Candidate
                    </span>
                  ) : m.status === 'DISMISSED' ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      Lead Dismissed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Possible Match — Requires Verification
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">
                    {new Date(m.createdAt).toLocaleDateString('en-PK')}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">
                  {m.reason}
                </p>

                {m.matchedPersonId && typeof m.matchedPersonId === 'object' && (
                  <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-800">
                      Cross-reference: {m.matchedPersonId.name} ({m.matchedPersonId.lastSeenCity})
                    </span>
                    <Link
                      to={`/find-and-reunite/person/${m.matchedPersonId._id || m.matchedPersonId.id}`}
                      className="text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      Compare Case →
                    </Link>
                  </div>
                )}

                {(m.sightingLocation || m.sightingDate) && (
                  <div className="text-[11px] text-slate-500 flex flex-wrap gap-3 pt-1">
                    {m.sightingLocation && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {m.sightingLocation}
                      </span>
                    )}
                    {m.sightingDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Seen: {new Date(m.sightingDate).toLocaleDateString('en-PK')}
                      </span>
                    )}
                  </div>
                )}

                <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
                  <span>Reported by: {m.submitterName || 'Community Member'}</span>
                  <span>Lead Ref: {(m._id || m.id).substring(0, 8)}</span>
                </div>

                {/* Authorized Lead Review Actions */}
                {(isAuthorizedReporter || isPlatformAdmin) && (
                  <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2">
                    {m.status === 'PENDING' ? (
                      <div className="flex items-center gap-2 w-full justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMatchToReview(m);
                            setReviewDecision('DISMISSED');
                            setDecisionNotes('');
                            setReviewError('');
                            setReviewModalOpen(true);
                          }}
                          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                          Dismiss Lead
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMatchToReview(m);
                            setReviewDecision('CONFIRMED');
                            setDecisionNotes('');
                            setReviewError('');
                            setReviewModalOpen(true);
                          }}
                          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white transition shadow-2xs cursor-pointer"
                        >
                          Confirm Match Candidate
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500 flex items-center justify-between w-full">
                        <span className="font-semibold text-slate-700">
                          Decision: {m.status === 'CONFIRMED' ? 'Confirmed Match Candidate' : 'Dismissed'}
                        </span>
                        {m.decidedAt && (
                          <span className="text-slate-400">
                            Reviewed on {new Date(m.decidedAt).toLocaleDateString('en-PK')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section: Candidate Suggestions (Deterministic Discovery Aid) */}
      {candidates.length > 0 && (
        <section className="space-y-4 pt-4">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <span>Candidate Match Suggestions</span>
              </h2>
              <p className="text-xs text-slate-500">
                Rule-based demographic comparison (same city, gender, age proximity) to discover related reports.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidates.map(({ candidate, similarityScore, reasons }) => (
              <div
                key={candidate._id || candidate.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full">
                      {similarityScore}% Compatibility
                    </span>
                    <span className="text-[11px] text-slate-500">{candidate.lastSeenCity}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{candidate.name}</h3>
                  <p className="text-xs text-slate-500">
                    {candidate.age ? `${candidate.age} yrs` : 'Age unspecified'} • {candidate.gender}
                  </p>

                  <div className="bg-slate-50 p-2 rounded-xl text-[11px] text-slate-600 space-y-1">
                    {reasons.map((r, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-amber-700 font-semibold">Requires Verification</span>
                  <Link
                    to={`/find-and-reunite/person/${candidate._id || candidate.id}`}
                    className="font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                  >
                    <span>Compare</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sighting / Possible Match Modal */}
      <Modal
        isOpen={matchModalOpen}
        onClose={() => setMatchModalOpen(false)}
        title="Submit Sighting Lead / Possible Match"
        size="md"
      >
        {matchSubmitSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Lead Submitted Successfully</h3>
              <p className="text-xs text-slate-600">
                Thank you for contributing to Pakistan's reunification network. Your lead has been securely logged as a <strong>Possible Match</strong> for case coordinators.
              </p>
            </div>
            <Button variant="primary" size="md" onClick={() => setMatchModalOpen(false)}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmitMatch} className="space-y-4 py-2">
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Notice:</strong> Please provide factual details regarding this person. Do not submit false or unverified rumors. Your contact details remain protected.
            </div>

            {matchSubmitError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{matchSubmitError}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="matchReason"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
              >
                Sighting Description / Why This May Match <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="matchReason"
                rows={3}
                required
                placeholder="e.g. Spotted someone matching this description near Raja Bazaar, wearing similar clothes..."
                value={matchReason}
                onChange={(e) => setMatchReason(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs sm:text-sm bg-white focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="sightingLocation"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
                >
                  Sighting Location (Optional)
                </label>
                <input
                  type="text"
                  id="sightingLocation"
                  placeholder="e.g. Near Metro Bus Terminal"
                  value={sightingLocation}
                  onChange={(e) => setSightingLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm bg-white focus:outline-hidden focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="sightingDate"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
                >
                  Sighting Date (Optional)
                </label>
                <input
                  type="date"
                  id="sightingDate"
                  value={sightingDate}
                  onChange={(e) => setSightingDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm bg-white focus:outline-hidden focus:border-emerald-600 transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="matchedPersonId"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
              >
                Cross-Reference Report ID (Optional)
              </label>
              <input
                type="text"
                id="matchedPersonId"
                placeholder="If linking to another existing case ID..."
                value={matchedPersonId}
                onChange={(e) => setMatchedPersonId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm bg-white focus:outline-hidden focus:border-emerald-600 transition"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setMatchModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isSubmittingMatch}
                disabled={isSubmittingMatch}
              >
                Submit Possible Match Lead
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* 1. Mark as Located Confirmation Modal */}
      <Modal
        isOpen={locatedModalOpen}
        onClose={() => setLocatedModalOpen(false)}
        title="Mark Person as Located"
        size="md"
      >
        <div className="space-y-4 py-2">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-2xl text-xs sm:text-sm space-y-2 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Are you sure this case has been successfully resolved?</span>
            </div>
            <p className="text-emerald-800 text-xs">
              Confirming this action will update the case status to <strong>LOCATED</strong>. The community and coordinators will be notified that the individual is safe and active searching has concluded.
            </p>
          </div>

          {statusActionError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{statusActionError}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="locatedNotes"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
            >
              Verification / Reunion Notes (Private &amp; Confidential)
            </label>
            <textarea
              id="locatedNotes"
              rows={3}
              placeholder="e.g. Reunited with family safely through coordinator assistance. Medical check passed."
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs sm:text-sm bg-white focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Internal notes are protected and will never be shown on public case directories.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setLocatedModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              loading={isUpdatingStatus}
              disabled={isUpdatingStatus}
              onClick={() => handleUpdateStatus('LOCATED')}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold"
            >
              Yes, Confirm Person as Located
            </Button>
          </div>
        </div>
      </Modal>

      {/* 2. Conclude & Close Case Modal */}
      <Modal
        isOpen={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        title="Conclude &amp; Close Case File"
        size="md"
      >
        <div className="space-y-4 py-2">
          <div className="bg-slate-100 border border-slate-200 text-slate-800 p-4 rounded-2xl text-xs sm:text-sm space-y-2 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Archive className="w-5 h-5 text-slate-700 shrink-0" />
              <span>Confirm Permanent Case Closure</span>
            </div>
            <p className="text-slate-600 text-xs">
              Closing this case file will archive it from active search directories. Historical data and verification logs will remain securely preserved for audit purposes.
            </p>
          </div>

          {statusActionError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{statusActionError}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="closeNotes"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
            >
              Closure Summary / Notes (Private)
            </label>
            <textarea
              id="closeNotes"
              rows={3}
              placeholder="e.g. Case fully concluded. All parties notified and record finalized."
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs sm:text-sm bg-white focus:outline-hidden focus:border-slate-600 transition"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setCloseModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              loading={isUpdatingStatus}
              disabled={isUpdatingStatus}
              onClick={() => handleUpdateStatus('CLOSED')}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold"
            >
              Confirm Case Closure
            </Button>
          </div>
        </div>
      </Modal>

      {/* 3. Administrator Reopen Case Modal */}
      <Modal
        isOpen={reopenModalOpen}
        onClose={() => setReopenModalOpen(false)}
        title="Reopen Case to Active Status"
        size="md"
      >
        <div className="space-y-4 py-2">
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs sm:text-sm space-y-1">
            <span className="font-bold block">Administrative Override:</span>
            <span>
              Reopening this case will reset its lifecycle status back to <strong>ACTIVE</strong> and make it discoverable in public searches.
            </span>
          </div>

          {statusActionError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{statusActionError}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="reopenNotes"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
            >
              Reopening Reason / Notes
            </label>
            <textarea
              id="reopenNotes"
              rows={3}
              placeholder="e.g. Previous location report was incorrect. Citizen remains unaccounted for."
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs sm:text-sm bg-white focus:outline-hidden focus:border-amber-600 transition"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setReopenModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              loading={isUpdatingStatus}
              disabled={isUpdatingStatus}
              onClick={() => handleUpdateStatus('ACTIVE')}
              className="bg-amber-600 hover:bg-amber-700 font-bold text-white"
            >
              Reopen Case to Active
            </Button>
          </div>
        </div>
      </Modal>

      {/* 4. Match Lead Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={
          reviewDecision === 'CONFIRMED'
            ? 'Confirm Match Candidate'
            : 'Dismiss Sighting Lead'
        }
        size="md"
      >
        <form onSubmit={handleReviewMatch} className="space-y-4 py-2">
          {selectedMatchToReview && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
              <span className="font-bold text-slate-700 block">Lead Details:</span>
              <p className="text-slate-600 italic leading-relaxed">
                "{selectedMatchToReview.reason}"
              </p>
              {selectedMatchToReview.sightingLocation && (
                <div className="text-slate-500">
                  Location: {selectedMatchToReview.sightingLocation}
                </div>
              )}
            </div>
          )}

          <div
            className={`p-3 rounded-xl border text-xs leading-relaxed ${
              reviewDecision === 'CONFIRMED'
                ? 'bg-purple-50 text-purple-900 border-purple-200'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {reviewDecision === 'CONFIRMED' ? (
              <span>
                <strong>Important:</strong> Confirming this match marks it as a verified candidate for coordinator follow-up. It does <em>not</em> automatically declare the person as located or close the case.
              </span>
            ) : (
              <span>
                Dismissing this lead records it as non-matching. The person case remains active and open for further leads.
              </span>
            )}
          </div>

          {reviewError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{reviewError}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="reviewNotes"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
            >
              Decision Notes (Optional)
            </label>
            <textarea
              id="reviewNotes"
              rows={2}
              placeholder="e.g. Cross-referenced with family description; candidate verified."
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs sm:text-sm bg-white focus:outline-hidden focus:border-purple-600 transition"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setReviewModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={reviewDecision === 'CONFIRMED' ? 'primary' : 'secondary'}
              size="md"
              loading={isSubmittingReview}
              disabled={isSubmittingReview}
              className={
                reviewDecision === 'CONFIRMED'
                  ? 'bg-purple-700 hover:bg-purple-800 font-bold'
                  : 'bg-slate-700 hover:bg-slate-800 font-bold'
              }
            >
              {reviewDecision === 'CONFIRMED' ? 'Confirm Candidate' : 'Dismiss Lead'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PersonDetailsPage;
