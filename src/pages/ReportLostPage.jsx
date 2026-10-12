import React, { useState, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Info,
  Lock,
} from 'lucide-react';
import { REPORT_CATEGORIES, PAKISTANI_CITIES } from '../utils/categories';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ImageUploader from '../components/ImageUploader';

export const ReportLostPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Max date is today (prevent selecting future dates)
  const todayDateString = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subCategory: '',
    brand: '',
    model: '',
    color: '',
    description: '',
    identifyingFeatures: '',
    lostDate: '',
    lostTime: '',
    city: '',
    area: '',
    locationDescription: '',
  });

  const [uploadedPhotos, setUploadedPhotos] = useState([]); // array of { file, previewUrl, name }
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdReport, setCreatedReport] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Item title is required (e.g. Samsung Galaxy S24)';
    }

    if (!formData.category) {
      newErrors.category = 'Please select an item category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please describe the item in detail';
    }

    if (!formData.lostDate) {
      newErrors.lostDate = 'Please specify the date when item was lost';
    } else {
      const selected = new Date(formData.lostDate);
      const today = new Date();
      if (selected > today) {
        newErrors.lostDate = 'Lost date cannot be in the future';
      }
    }

    if (!formData.city) {
      newErrors.city = 'Please select the city where item was lost';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Area / neighborhood is required (e.g. Saddar, Gulberg)';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Build FormData to send multi-part file uploads and fields
      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('category', formData.category);
      submitData.append('subCategory', formData.subCategory.trim());
      submitData.append('brand', formData.brand.trim());
      submitData.append('model', formData.model.trim());
      submitData.append('color', formData.color.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('identifyingFeatures', formData.identifyingFeatures.trim());
      submitData.append('lostDate', formData.lostDate);
      submitData.append('lostTime', formData.lostTime.trim());
      submitData.append('city', formData.city);
      submitData.append('area', formData.area.trim());
      submitData.append('locationDescription', formData.locationDescription.trim());

      // Append selected image files
      uploadedPhotos.forEach((item) => {
        if (item.file) {
          submitData.append('photos', item.file);
        }
      });

      const res = await reportService.createLostReport(submitData);

      if (res?.success && res?.report) {
        setCreatedReport(res.report);
        setShowSuccessModal(true);
      } else {
        throw new Error(res?.message || 'Failed to submit report');
      }
    } catch (err) {
      setServerError(
        err.message || 'Unable to submit report. Please check your network and try again.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishSuccess = () => {
    setShowSuccessModal(false);
    navigate(ROUTES.DASHBOARD_LOST);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 sm:p-8 flex items-start gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              National Lost Registry
            </span>
            <span className="bg-rose-200/60 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Type: LOST
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Report a Lost Item
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Tell us what you lost and where you lost it. Your report may help connect you with someone who finds it.
          </p>
        </div>
      </div>

      {/* Login Requirement Banner if unauthenticated */}
      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              You must be logged into your verified citizen account to submit a lost report.
            </span>
          </div>
          <Link
            to={ROUTES.LOGIN}
            state={{ from: location }}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl whitespace-nowrap transition"
          >
            Sign In to Continue
          </Link>
        </div>
      )}

      {/* Server Error Alert */}
      {serverError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Submission Error</span>
            <span>{serverError}</span>
          </div>
        </div>
      )}

      {/* Main Report Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
        {/* Section A — Item Information */}
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Section A — Item Information
            </h2>
            <p className="text-xs text-slate-500">
              Provide specific item characteristics to help finders identify your property.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Item Title"
                name="title"
                placeholder="e.g. Samsung Galaxy S24, Brown Leather Bifold Wallet"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                required
              />
            </div>

            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={REPORT_CATEGORIES}
              error={errors.category}
              required
            />

            <Input
              label="Sub Category (Optional)"
              name="subCategory"
              placeholder="e.g. Smartphone, Smart Card, Keyring"
              value={formData.subCategory}
              onChange={handleChange}
            />

            <Input
              label="Brand / Manufacturer (Optional)"
              name="brand"
              placeholder="e.g. Samsung, Apple, Dell, Honda"
              value={formData.brand}
              onChange={handleChange}
            />

            <Input
              label="Model (Optional)"
              name="model"
              placeholder="e.g. S24 Ultra, Latitude 5590"
              value={formData.model}
              onChange={handleChange}
            />

            <div className="sm:col-span-2">
              <Input
                label="Color (Optional)"
                name="color"
                placeholder="e.g. Phantom Black, Titanium Gray, Navy Blue"
                value={formData.color}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Item Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item in detail, including physical condition, casing, and contents..."
                className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-100 ${
                  errors.description ? 'border-rose-400' : 'border-slate-300 focus:border-emerald-600'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.description}</span>
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Identifying Features (Optional)
              </label>
              <textarea
                name="identifyingFeatures"
                rows={2}
                value={formData.identifyingFeatures}
                onChange={handleChange}
                placeholder="Small scratch near the camera, black case, sticker on the back..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
              <p className="text-xs text-slate-400 mt-1">
                Do not expose sensitive security passwords or PINs.
              </p>
            </div>
          </div>
        </div>

        {/* Section B — Lost Location */}
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Section B — Lost Location
            </h2>
            <p className="text-xs text-slate-500">
              Tell the community where the item was lost in Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              options={PAKISTANI_CITIES}
              error={errors.city}
              required
            />

            <Input
              label="Area / Neighborhood"
              name="area"
              placeholder="e.g. Saddar, Gulshan-e-Iqbal, University Road"
              value={formData.area}
              onChange={handleChange}
              error={errors.area}
              required
            />

            <div className="sm:col-span-2">
              <Input
                label="Location Description (Optional)"
                name="locationDescription"
                placeholder="e.g. Near the main entrance of the shopping mall, Metro Bus counter"
                value={formData.locationDescription}
                onChange={handleChange}
                helperText="Approximate landmark or venue context (do not provide exact home address)."
              />
            </div>
          </div>
        </div>

        {/* Section C — Lost Date & Time */}
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Section C — Lost Date &amp; Time
            </h2>
            <p className="text-xs text-slate-500">
              When did you last have the item?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Lost Date"
              name="lostDate"
              type="date"
              max={todayDateString}
              value={formData.lostDate}
              onChange={handleChange}
              error={errors.lostDate}
              required
              helperText="Future dates are not permitted."
            />

            <Input
              label="Lost Time (Optional)"
              name="lostTime"
              type="time"
              value={formData.lostTime}
              onChange={handleChange}
              helperText="Approximate time if known."
            />
          </div>
        </div>

        {/* Section D — Photos */}
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Section D — Item Photos
            </h2>
            <p className="text-xs text-slate-500">
              Upload clear photos of the lost item or similar reference photos (up to 5 images).
            </p>
          </div>

          <ImageUploader
            images={uploadedPhotos}
            onImagesChange={setUploadedPhotos}
            maxFiles={5}
            maxSizeMB={5}
          />
        </div>

        {/* Form Submission Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Saved permanently to REUNIVO registry.</span>
          </div>

          <Button
            type="submit"
            variant="danger"
            size="lg"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8"
          >
            {isSubmitting ? 'Submitting...' : 'Report Lost Item'}
          </Button>
        </div>
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleFinishSuccess}
        title="Lost Item Reported Successfully!"
        subtitle="Your report is now active in the national database"
      >
        <div className="space-y-4 text-center">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Report Registered!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Your lost item <span className="font-semibold text-slate-900">“{createdReport?.title}”</span> has been added to REUNIVO. We&apos;ll help you identify possible matches as the platform develops.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-600 space-y-1 text-left font-mono">
            <div><strong>Report ID:</strong> {createdReport?._id}</div>
            <div><strong>Status:</strong> {createdReport?.status}</div>
            <div><strong>City:</strong> {createdReport?.city} ({createdReport?.area})</div>
            <div><strong>Photos:</strong> {createdReport?.photos?.length || 0} attached</div>
          </div>
          <div className="pt-3">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleFinishSuccess}
            >
              View My Reports in Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportLostPage;
