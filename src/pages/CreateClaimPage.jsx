import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowLeft,
  UploadCloud,
  FileText,
  X,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import { claimService } from '../services/claimService';
import { VERIFICATION_QUESTIONS } from '../utils/claimQuestions';
import { ROUTES } from '../utils/constants';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

export const CreateClaimPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [report, setReport] = useState(null);
  const [isLoadingReport, setIsLoadingReport] = useState(true);
  const [reportError, setReportError] = useState('');

  // Form states
  const [ownershipDescription, setOwnershipDescription] = useState('');
  const [answers, setAnswers] = useState(
    VERIFICATION_QUESTIONS.reduce((acc, q) => {
      acc[q.id] = '';
      return acc;
    }, {})
  );
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [proofFiles, setProofFiles] = useState([]); // array of { file, previewUrl, name, isPdf }

  // Submission & Validation states
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [existingClaimId, setExistingClaimId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdClaim, setCreatedClaim] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 1. Fetch target found report
  useEffect(() => {
    let isMounted = true;
    const fetchFoundReport = async () => {
      setIsLoadingReport(true);
      setReportError('');
      try {
        const res = await reportService.getReportById(reportId);
        if (res?.success && res?.report && isMounted) {
          const fetchedReport = res.report;
          setReport(fetchedReport);

          // Validation checks on report type & status
          const type = (fetchedReport.type || fetchedReport.reportType || '').toUpperCase();
          if (type !== 'FOUND') {
            setReportError('This item cannot be claimed. Only found items accept ownership claims.');
          } else if (fetchedReport.status !== 'ACTIVE') {
            setReportError(`This item is no longer available for new claims (Status: ${fetchedReport.status}).`);
          } else if (user && fetchedReport.user && String(user._id || user.id) === String(fetchedReport.user._id || fetchedReport.user)) {
            setReportError('You cannot claim an item that you reported as found.');
          }
        } else {
          setReportError('This found item could not be located.');
        }
      } catch (err) {
        if (isMounted) setReportError(err.message || 'Unable to load found item details.');
      } finally {
        if (isMounted) setIsLoadingReport(false);
      }
    };

    fetchFoundReport();
    return () => {
      isMounted = false;
    };
  }, [reportId, user]);

  // Answer change handler
  const handleAnswerChange = (qId, val) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
    if (errors[qId]) {
      setErrors((prev) => ({ ...prev, [qId]: '' }));
    }
  };

  // Proof files handler
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const allowedExts = [
      '.jpg',
      '.jpeg',
      '.png',
      '.webp',
      '.jfif',
      '.pjpeg',
      '.pjp',
      '.avif',
      '.heic',
      '.heif',
      '.bmp',
      '.gif',
      '.pdf',
      '.doc',
      '.docx',
    ];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    const newProofItems = [];
    let uploadErrMsg = '';

    files.forEach((file) => {
      if (proofFiles.length + newProofItems.length >= 5) {
        uploadErrMsg = 'You can upload a maximum of 5 supporting proof files.';
        return;
      }

      const ext = (file.name.substring(file.name.lastIndexOf('.')) || '').toLowerCase();
      const isValid = file.type?.startsWith('image/') || file.type === 'application/pdf' || allowedExts.includes(ext);

      if (!isValid) {
        uploadErrMsg = `"${file.name}" is an unsupported format. Please upload an image or PDF.`;
        return;
      }

      if (file.size > maxSizeBytes) {
        uploadErrMsg = `File "${file.name}" exceeds 5MB limit. Please choose a smaller file.`;
        return;
      }

      const isPdf = file.type === 'application/pdf';
      const previewUrl = isPdf ? null : URL.createObjectURL(file);

      newProofItems.push({
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
        previewUrl,
        isPdf,
      });
    });

    if (uploadErrMsg) {
      setServerError(uploadErrMsg);
    } else {
      setServerError('');
    }

    setProofFiles((prev) => [...prev, ...newProofItems]);
  };

  const handleRemoveProof = (index) => {
    setProofFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Client validation
  const validateForm = () => {
    const newErrors = {};

    if (!ownershipDescription.trim()) {
      newErrors.ownershipDescription = 'Please explain why you believe this item belongs to you.';
    }

    // At least one verification question should have an answer
    const answeredCount = Object.values(answers).filter((a) => a.trim().length > 0).length;
    if (answeredCount === 0) {
      newErrors.verification = 'Please answer at least one verification question to help verify ownership.';
    }

    return newErrors;
  };

  // Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setExistingClaimId(null);

    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Build question/answer array
      const securityAnswersList = VERIFICATION_QUESTIONS.map((q) => ({
        question: q.question,
        answer: answers[q.id]?.trim() || '',
      })).filter((qa) => qa.answer.length > 0);

      // Build FormData for multipart upload
      const formData = new FormData();
      formData.append('report', reportId);
      formData.append('ownershipDescription', ownershipDescription.trim());
      formData.append('securityAnswers', JSON.stringify(securityAnswersList));
      formData.append('additionalMessage', additionalMessage.trim());

      // Append proof files
      proofFiles.forEach((item) => {
        if (item.file) {
          formData.append('proofFiles', item.file);
        }
      });

      const res = await claimService.createClaim(formData);

      if (res?.success && res?.claim) {
        setCreatedClaim(res.claim);
        setShowSuccessModal(true);
      } else {
        throw new Error(res?.message || 'Failed to submit claim');
      }
    } catch (err) {
      setServerError(err.message || 'Unable to submit claim. Please try again.');
      if (err.existingClaimId) {
        setExistingClaimId(err.existingClaimId);
      }
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingReport) {
    return <Loading message="Loading found item details for claim verification..." fullHeight />;
  }

  if (reportError) {
    return (
      <div className="max-w-2xl mx-auto my-8 bg-white rounded-3xl border border-rose-200 p-8 text-center space-y-4 shadow-xs">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Unable to Submit Claim</h2>
        <p className="text-sm text-slate-600 leading-relaxed">{reportError}</p>
        <div className="pt-2">
          <Link to={ROUTES.SEARCH}>
            <Button variant="outline" size="sm" icon={ArrowLeft}>
              Back to Search Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const rawDate = report?.foundDate || report?.date;
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown date';

  const reportImage = report?.photos?.[0] || report?.image || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 flex items-start gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Ownership Verification Protocol
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Claim This Found Item
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            If you believe this item belongs to you, provide information that can help verify ownership. Do not share unnecessary sensitive information like passwords or PINs.
          </p>
        </div>
      </div>

      {/* Found Item Summary Card (Hides secret identifying features) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <img
            src={reportImage}
            alt={report?.title}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-slate-100 shadow-2xs"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Found Item
              </span>
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                {report?.category}
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900 line-clamp-1">
              {report?.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{report?.foundArea || report?.area ? `${report?.foundArea || report?.area}, ` : ''}{report?.foundCity || report?.city}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Found: {formattedDate}</span>
              </span>
              {report?.brand && (
                <span className="bg-slate-50 px-1.5 py-0.5 rounded text-slate-600 border border-slate-100">
                  Brand: {report.brand}
                </span>
              )}
            </div>
          </div>
        </div>

        <Link
          to={`/item/${reportId}`}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline whitespace-nowrap self-end sm:self-auto"
        >
          View Public Details →
        </Link>
      </div>

      {/* Server Error Alert Banner */}
      {serverError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{serverError}</span>
          </div>
          {existingClaimId && (
            <Link
              to={`/claims/${existingClaimId}`}
              className="px-3 py-1 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition whitespace-nowrap"
            >
              View Existing Claim
            </Link>
          )}
        </div>
      )}

      {/* Claim Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
        {/* Section 1: Ownership Description */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              1. Why do you believe this item belongs to you? <span className="text-rose-500">*</span>
            </h2>
            <p className="text-xs text-slate-500">
              Provide specific context about where and when you lost it, contents, or circumstances.
            </p>
          </div>

          <div>
            <textarea
              rows={4}
              value={ownershipDescription}
              onChange={(e) => {
                setOwnershipDescription(e.target.value);
                if (errors.ownershipDescription) {
                  setErrors((prev) => ({ ...prev, ownershipDescription: '' }));
                }
              }}
              placeholder="Describe why you believe this is your item. Mention details that can help verify ownership (e.g. circumstances of loss, specific contents, custom accessories)..."
              className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-100 ${
                errors.ownershipDescription ? 'border-rose-400' : 'border-slate-300 focus:border-emerald-600'
              }`}
            />
            {errors.ownershipDescription && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.ownershipDescription}</span>
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Verification Questions */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              2. Ownership Verification Questions
            </h2>
            <p className="text-xs text-slate-500">
              Answer the questions you know. The finder will compare your answers against the item during review.
            </p>
          </div>

          {errors.verification && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.verification}</span>
            </div>
          )}

          <div className="space-y-4">
            {VERIFICATION_QUESTIONS.map((q, idx) => (
              <div key={q.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  {idx + 1}. {q.question}
                </label>
                <input
                  type="text"
                  value={answers[q.id]}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Supporting Proof (Optional Uploads) */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              3. Supporting Proof (Optional)
            </h2>
            <p className="text-xs text-slate-500">
              Upload receipts, purchase invoices, warranty cards, or original photos with the item (up to 5 files, JPG, PNG, WEBP, or PDF up to 5MB).
            </p>
          </div>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center transition bg-slate-50 hover:bg-emerald-50/20 cursor-pointer relative">
            <input
              type="file"
              multiple
              accept="image/*,application/pdf,.doc,.docx"
              onChange={handleFileChange}
              disabled={proofFiles.length >= 5}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
            />
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white rounded-xl shadow-2xs border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                <UploadCloud className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-semibold text-emerald-700">Click to upload proof</span> or drag and drop
              </div>
              <p className="text-[11px] text-slate-400">Receipts, photos, invoices (JPG, PNG, PDF max 5MB)</p>
            </div>
          </div>

          {/* Uploaded Files Previews */}
          {proofFiles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {proofFiles.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.isPdf ? (
                      <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                    ) : (
                      <img
                        src={item.previewUrl}
                        alt="Proof preview"
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-100"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400">{item.size} MB</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveProof(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Additional Information (Optional) */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              4. Additional Message for Finder (Optional)
            </h2>
            <p className="text-xs text-slate-500">
              Any polite message or convenient public handover preferences.
            </p>
          </div>

          <div>
            <textarea
              rows={2}
              value={additionalMessage}
              onChange={(e) => setAdditionalMessage(e.target.value)}
              placeholder="e.g. Thank you so much for reporting this. I can meet at a nearby shopping mall or police desk at your convenience..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* Form Submission Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Submitted securely. Status will remain PENDING until finder review.</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8"
          >
            {isSubmitting ? 'Submitting Claim...' : 'Submit Claim'}
          </Button>
        </div>
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => navigate(`/claims/${createdClaim?._id || ''}`)}
        title="Claim Submitted Successfully"
        subtitle="Your claim is now awaiting review"
      >
        <div className="space-y-4 text-center">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Ownership Claim Registered!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Your claim for <span className="font-semibold text-slate-900">“{report?.title}”</span> has been received and set to <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">PENDING</span> status.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-600 space-y-1 text-left font-mono">
            <div><strong>Claim ID:</strong> {createdClaim?._id}</div>
            <div><strong>Status:</strong> {createdClaim?.status || 'PENDING'}</div>
            <div><strong>Proof Files:</strong> {createdClaim?.proofFiles?.length || 0} attached</div>
            <div><strong>Finder Review:</strong> Awaiting verification</div>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            Note: Submitting a claim does not automatically confirm ownership. The finder will review your provided answers.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row gap-2">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => navigate(`/claims/${createdClaim?._id}`)}
            >
              View My Claim Details
            </Button>
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => navigate(ROUTES.DASHBOARD_CLAIMS)}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateClaimPage;
