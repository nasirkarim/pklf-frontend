import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  FileText,
  Lock,
  ExternalLink,
  XCircle,
  HelpCircle,
  Check,
  X,
  Phone,
  Mail,
  Sparkles,
  PackageCheck,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { claimService } from '../services/claimService';
import { ROUTES } from '../utils/constants';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Modal from '../components/Modal';

export const ClaimDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { toast } = useToast();

  const [claim, setClaim] = useState(null);
  const [finder, setFinder] = useState(null);
  const [isClaimantState, setIsClaimantState] = useState(false);
  const [isFinderState, setIsFinderState] = useState(false);
  const [isAdminState, setIsAdminState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Cancellation modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Approval modal
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Rejection modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  // Recovery modal
  const [recoverModalOpen, setRecoverModalOpen] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  const fetchClaimDetails = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await claimService.getClaimById(id);
      if (res?.success && res?.claim) {
        setClaim(res.claim);
        if (res.finder) setFinder(res.finder);
        setIsClaimantState(Boolean(res.isClaimant));
        setIsFinderState(Boolean(res.isFinder));
        setIsAdminState(Boolean(res.isAdmin));
      } else {
        throw new Error(res?.message || 'Failed to load claim');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to access claim information.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClaimDetails();
  }, [fetchClaimDetails]);

  // Handle claim cancellation
  const handleCancelClaim = async () => {
    setIsCancelling(true);
    try {
      const res = await claimService.cancelClaim(id);
      if (res?.success) {
        toast.success('Claim cancelled successfully');
        setCancelModalOpen(false);
        fetchClaimDetails();
      } else {
        throw new Error(res?.message || 'Could not cancel claim');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel claim');
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle finder/admin approval
  const handleApproveClaim = async () => {
    setIsApproving(true);
    try {
      const res = await claimService.approveClaim(id);
      if (res?.success) {
        toast.success('Claim approved successfully');
        setApproveModalOpen(false);
        fetchClaimDetails();
      } else {
        throw new Error(res?.message || 'Failed to approve claim');
      }
    } catch (err) {
      toast.error(err.message || 'Could not approve claim');
    } finally {
      setIsApproving(false);
    }
  };

  // Handle finder/admin rejection
  const handleRejectClaim = async () => {
    setIsRejecting(true);
    try {
      const res = await claimService.rejectClaim(id, rejectionReason);
      if (res?.success) {
        toast.success('Claim rejected');
        setRejectModalOpen(false);
        setRejectionReason('');
        fetchClaimDetails();
      } else {
        throw new Error(res?.message || 'Failed to reject claim');
      }
    } catch (err) {
      toast.error(err.message || 'Could not reject claim');
    } finally {
      setIsRejecting(false);
    }
  };

  // Handle recovery confirmation
  const handleRecoverItem = async () => {
    setIsRecovering(true);
    try {
      const res = await claimService.recoverClaim(id);
      if (res?.success) {
        toast.success('Item recovery confirmed!');
        setRecoverModalOpen(false);
        fetchClaimDetails();
      } else {
        throw new Error(res?.message || 'Failed to confirm item recovery');
      }
    } catch (err) {
      toast.error(err.message || 'Could not confirm recovery');
    } finally {
      setIsRecovering(false);
    }
  };

  if (isLoading) {
    return <Loading message="Loading claim details and verification records..." fullHeight />;
  }

  if (errorMessage) {
    return (
      <div className="max-w-2xl mx-auto my-8 bg-white rounded-3xl border border-rose-200 p-8 text-center space-y-4 shadow-xs">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-sm text-slate-600 leading-relaxed">{errorMessage}</p>
        <div className="pt-2">
          <Link to={ROUTES.DASHBOARD_CLAIMS}>
            <Button variant="outline" size="sm" icon={ArrowLeft}>
              Back to My Claims
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!claim) return null;

  const report = claim.report || {};
  const reportId = report._id || report.id;
  const status = (claim.status || 'PENDING').toUpperCase();
  const reportStatus = (report.status || 'ACTIVE').toUpperCase();

  const isClaimant = isClaimantState || (user && String(user._id || user.id) === String(claim.claimant?._id || claim.claimant));
  const isFinder = isFinderState || (user && String(user._id || user.id) === String(report.user?._id || report.user));
  const isAdmin = isAdminState || user?.role === 'admin';

  const canReview = (isFinder || isAdmin) && status === 'PENDING';
  const isMatchConfirmed = status === 'APPROVED' || status === 'RECOVERED';
  const isRecovered = status === 'RECOVERED' || reportStatus === 'RECOVERED';

  const reportImage =
    report.photos?.[0] ||
    report.image ||
    'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Claims</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Claim ID:</span>
          <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
            {claim._id}
          </span>
        </div>
      </div>

      {/* Recovered Celebration State Banner */}
      {isRecovered && (
        <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-teal-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 text-emerald-200 flex items-center justify-center shrink-0">
                <PackageCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-400/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-400/30 mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Handover Complete
                </div>
                <h1 className="text-xl sm:text-2xl font-black">🎉 Item Successfully Recovered!</h1>
                <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
                  This item has been safely returned to its rightful owner. Thank you for making Pakistan a more honest and connected community.
                </p>
                {claim.recoveredAt && (
                  <p className="text-xs text-emerald-300/80 mt-2">
                    Recovered on {new Date(claim.recoveredAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                )}
              </div>
            </div>

            <Link to={ROUTES.DASHBOARD_CLAIMS}>
              <button className="bg-white text-emerald-900 font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-emerald-50 transition cursor-pointer shadow-xs">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Match Confirmed & Handover State Banner */}
      {!isRecovered && isMatchConfirmed && (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 text-purple-200 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-purple-400/20 text-purple-300 px-3 py-1 rounded-full border border-purple-400/30 mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Match Confirmed & Verified
                </div>
                <h1 className="text-xl sm:text-2xl font-black">MATCH CONFIRMED — Handover In Progress</h1>
                <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-xl">
                  The finder has verified and approved the ownership claim. Contact details are now safely accessible below to arrange physical inspection and handover.
                </p>
              </div>
            </div>

            {(isFinder || isClaimant || isAdmin) && (
              <button
                onClick={() => setRecoverModalOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-md shrink-0"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Mark as Recovered</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pending Status Banner */}
      {status === 'PENDING' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">Claim Waiting for Finder Review</h3>
                <StatusBadge type="PENDING" size="xs" />
              </div>
              <p className="text-xs text-amber-800/90 mt-0.5">
                {isClaimant
                  ? 'Your ownership information has been securely transmitted. The finder will review your details.'
                  : 'A citizen has claimed this found item. Please carefully inspect their ownership description and proof before deciding.'}
              </p>
            </div>
          </div>

          {/* Quick actions for Finder/Admin */}
          {canReview && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setApproveModalOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" /> Accept Claim
              </button>
              <button
                onClick={() => setRejectModalOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Reject Claim
              </button>
            </div>
          )}
        </div>
      )}

      {/* Rejected Status Banner */}
      {status === 'REJECTED' && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl p-5 sm:p-6 space-y-2">
          <div className="flex items-center gap-2.5">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <h3 className="font-bold text-sm sm:text-base">Claim Not Approved</h3>
            <StatusBadge type="REJECTED" size="xs" />
          </div>
          <p className="text-xs text-rose-800 pl-7">
            The verification information provided did not match the item specifications or ownership criteria.
          </p>
          {claim.rejectionReason && (
            <div className="mt-2 ml-7 bg-white/80 border border-rose-200 rounded-xl p-3 text-xs text-rose-900">
              <span className="font-bold">Reason provided: </span>
              {claim.rejectionReason}
            </div>
          )}
        </div>
      )}

      {/* Cancelled Status Banner */}
      {status === 'CANCELLED' && (
        <div className="bg-slate-100 border border-slate-200 text-slate-700 rounded-2xl p-5 sm:p-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-slate-400 shrink-0" />
          <div>
            <h3 className="font-bold text-sm">Claim Cancelled</h3>
            <p className="text-xs text-slate-500">This claim was cancelled by the claimant.</p>
          </div>
        </div>
      )}

      {/* Handover & Contact Information Card (Active only when Match Confirmed) */}
      {isMatchConfirmed && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 border-b border-indigo-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Handover &amp; Contact Coordination</h2>
              <p className="text-xs text-slate-500">
                Official contact details securely exchanged following match confirmation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Claimant / Owner Contact */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-indigo-700 tracking-wider uppercase">
                Owner / Claimant
              </span>
              <div className="font-bold text-sm text-slate-900">{claim.claimant?.name || 'Claimant'}</div>
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{claim.claimant?.phone || 'Phone shared upon contact'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{claim.claimant?.email || 'Email shared upon contact'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{claim.claimant?.city || 'Pakistan'}</span>
                </div>
              </div>
            </div>

            {/* Finder Contact */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-emerald-700 tracking-wider uppercase">
                Finder / Custodian
              </span>
              <div className="font-bold text-sm text-slate-900">{finder?.name || report.user?.name || 'Finder'}</div>
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{finder?.phone || 'Phone shared upon contact'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{finder?.email || 'Email shared upon contact'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{report.currentLocation || report.foundCity || 'Custody Location'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pakistan Handover Safety Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Safe Handover Advice:</span>
              <p className="mt-0.5 text-amber-800">
                Please conduct the handover in a secure public venue (e.g., local police station, major mall, or bank). Inspect serial numbers or documents before final handover.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Target Found Item Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Item Under Claim
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              {report.title || 'Found Item'}
            </h2>
          </div>
          <Link
            to={`/item/${reportId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition"
          >
            <span>View Original Found Report</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={reportImage}
              alt={report.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:col-span-2 space-y-3 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Category</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {(report.category || 'other').replace(/_/g, ' ')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Found Location</span>
                <span className="font-semibold text-slate-800">
                  {report.foundCity || report.city || 'Pakistan'}
                  {report.foundArea || report.area ? `, ${report.foundArea || report.area}` : ''}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Brand / Model</span>
                <span className="font-semibold text-slate-800">
                  {report.brand || 'Unspecified'} {report.model ? `(${report.model})` : ''}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Color</span>
                <span className="font-semibold text-slate-800">{report.color || 'Unspecified'}</span>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed text-xs">
              {report.description}
            </p>
          </div>
        </div>
      </div>

      {/* Claimant Ownership Statement & Verification Evidence */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <FileText className="w-5 h-5 text-emerald-700" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Claimant&apos;s Ownership Statement
            </h2>
            <p className="text-xs text-slate-500">
              Information submitted by the claimant to verify ownership.
            </p>
          </div>
        </div>

        {/* Ownership Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Why the claimant believes this item belongs to them:
          </label>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
            {claim.ownershipDescription}
          </div>
        </div>

        {/* Security / Verification Question Answers */}
        {claim.securityAnswers && claim.securityAnswers.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              <span>Answers to Verification Questions:</span>
            </div>

            <div className="space-y-2.5">
              {claim.securityAnswers.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1"
                >
                  <p className="text-xs font-semibold text-slate-700">
                    Q: {item.question}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-900 font-medium pl-3 border-l-2 border-emerald-600">
                    A: {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Private Supporting Proof Files */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Supporting Proof Documents &amp; Photos:</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Private (Only visible to finder and admin)
            </span>
          </div>

          {claim.proofFiles && claim.proofFiles.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {claim.proofFiles.map((fileUrl, index) => {
                const isPdf = fileUrl.toLowerCase().includes('.pdf');
                const authUrl = token
                  ? `${fileUrl}${fileUrl.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`
                  : fileUrl;
                return (
                  <a
                    key={index}
                    href={authUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group border border-slate-200 rounded-2xl p-3 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition flex flex-col items-center justify-center text-center gap-2"
                  >
                    {isPdf ? (
                      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                    ) : (
                      <img
                        src={authUrl}
                        alt={`Proof ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-xl border border-slate-200 group-hover:scale-105 transition"
                      />
                    )}
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-800 truncate max-w-[120px]">
                      {isPdf ? 'PDF Proof' : `Proof Document ${index + 1}`}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <span>View File</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-4 text-center text-xs text-slate-400">
              No additional files or photos were uploaded with this claim.
            </div>
          )}
        </div>

        {/* Additional Message */}
        {claim.additionalMessage && (
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-slate-700">Additional Claimant Notes:</label>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-600">
              {claim.additionalMessage}
            </div>
          </div>
        )}
      </div>

      {/* Review Actions for Finder / Admin */}
      {canReview && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900">
              {isFinder ? 'Finder Ownership Decision' : 'Admin Claim Moderation'}
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Please compare the claimant’s description, answers, and supporting proof against the item in your custody. Accepting this claim will confirm the match and notify the owner.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => setApproveModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl transition shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Accept Claim &amp; Confirm Match</span>
            </button>
            <button
              onClick={() => setRejectModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-sm font-bold rounded-xl transition cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Reject Claim</span>
            </button>
          </div>
        </div>
      )}

      {/* Cancel Action for Claimant */}
      {isClaimant && status === 'PENDING' && (
        <div className="pt-2 text-center sm:text-right">
          <button
            onClick={() => setCancelModalOpen(true)}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition cursor-pointer inline-flex items-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancel This Claim Request</span>
          </button>
        </div>
      )}

      {/* Modal: Confirm Accept Claim */}
      <Modal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        title="Confirm Claim Acceptance"
      >
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-slate-900 text-base">Accept Ownership Verification?</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Are you confident that the claimant is the rightful owner of this item? This will mark the report as <strong>MATCHED</strong> and allow contact exchange for handover.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              disabled={isApproving}
              onClick={() => setApproveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              loading={isApproving}
              onClick={handleApproveClaim}
            >
              Confirm Acceptance
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Reject Claim */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Ownership Claim"
      >
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-slate-900 text-base">Reject Claim Request</h3>
            <p className="text-xs text-slate-600 mt-1">
              Please state why this claim could not be accepted so the claimant understands.
            </p>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-700">Rejection Reason (Optional):</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Unique identifying marks did not match; model or serial number mismatch."
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              disabled={isRejecting}
              onClick={() => setRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              fullWidth
              loading={isRejecting}
              onClick={handleRejectClaim}
            >
              Reject Claim
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Confirm Handover & Recovery */}
      <Modal
        isOpen={recoverModalOpen}
        onClose={() => setRecoverModalOpen(false)}
        title="Complete Item Recovery"
      >
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-slate-900 text-base">Confirm Handover &amp; Recovery</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Has the item been safely inspected and handed over to the owner? Confirming this will permanently mark the report as <strong>RECOVERED</strong>.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              disabled={isRecovering}
              onClick={() => setRecoverModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              loading={isRecovering}
              onClick={handleRecoverItem}
            >
              Yes, Handover Complete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Cancel Claim */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Claim Request"
      >
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <XCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Cancel your claim?</h3>
          <p className="text-xs text-slate-600">
            Are you sure you want to withdraw this claim request? This cannot be undone.
          </p>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              disabled={isCancelling}
              onClick={() => setCancelModalOpen(false)}
            >
              Nevermind
            </Button>
            <Button
              variant="danger"
              size="md"
              fullWidth
              loading={isCancelling}
              onClick={handleCancelClaim}
            >
              Yes, Cancel Claim
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClaimDetailsPage;
