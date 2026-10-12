import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  Lock,
} from 'lucide-react';
import {
  REPORT_CATEGORIES,
  PAKISTANI_CITIES,
  CURRENT_LOCATION_OPTIONS,
} from '../utils/categories';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ImageUploader from '../components/ImageUploader';

export const ReportFoundPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Maximum allowed date is today (prevent selecting future dates)
  const todayDateString = React.useMemo(() => new Date().toISOString().split('T')[0], []);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subCategory: '',
    brand: '',
    model: '',
    color: '',
    description: '',
    identifyingFeatures: '',
    foundDate: '',
    foundTime: '',
    city: '',
    area: '',
    locationDescription: '',
    currentLocation: '',
    currentKeepingDescription: '',
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
      newErrors.title = 'Item title is required (e.g. Black Samsung Galaxy Phone)';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please describe the item in detail';
    }

    if (!formData.foundDate) {
      newErrors.foundDate = 'Please select the date found';
    } else {
      const selected = new Date(formData.foundDate);
      const today = new Date();
      if (selected > today) {
        newErrors.foundDate = 'Found date cannot be in the future';
      }
    }

    if (!formData.city) {
      newErrors.city = 'Please select the city where found';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Area / neighborhood is required (e.g. Saddar, Gulshan-e-Iqbal)';
    }

    if (!formData.currentLocation.trim()) {
      newErrors.currentLocation = 'Please select where the item is currently kept';
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
      submitData.append('foundDate', formData.foundDate);
      submitData.append('foundTime', formData.foundTime.trim());
      submitData.append('city', formData.city);
      submitData.append('foundCity', formData.city);
      submitData.append('area', formData.area.trim());
      submitData.append('foundArea', formData.area.trim());
      submitData.append('locationDescription', formData.locationDescription.trim());
      submitData.append('foundLocationDescription', formData.locationDescription.trim());
      submitData.append('currentLocation', formData.currentLocation.trim());
      submitData.append('currentKeepingDescription', formData.currentKeepingDescription.trim());

      // Append selected image files
      uploadedPhotos.forEach((item) => {
        if (item.file) {
          submitData.append('photos', item.file);
        }
      });

      const res = await reportService.createFoundReport(submitData);

      if (res?.success && res?.report) {
        setCreatedReport(res.report);
        setShowSuccessModal(true);
      } else {
        throw new Error(res?.message || 'Failed to submit found report');
      }
    } catch (err) {
      setServerError(
        err.message || 'Unable to submit report. Please check your connection and try again.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishSuccess = () => {
    setShowSuccessModal(false);
    navigate(ROUTES.DASHBOARD_FOUND);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 flex items-start gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Good Samaritan Registry
            </span>
            <span className="bg-emerald-200/60 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Type: FOUND
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Report a Found Item
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Found something that may belong to someone? Report it here and help reunite it with its owner.
          </p>
        </div>
      </div>

      {/* Login Requirement Banner if unauthenticated */}
      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              You must be logged in to submit a found item report.
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

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
        {/* Section A — Item Information */}
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Section A — Item Information
            </h2>
            <p className="text-xs text-slate-500">
              Provide visible details of what was found.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Item Title"
                name="title"
                placeholder="e.g. Black Samsung Galaxy Phone, Honda Bike Keys, NADRA CNIC Card"
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
              label="Brand / Make (Optional)"
              name="brand"
              placeholder="e.g. Samsung, Apple, Honda, Dell"
              value={formData.brand}
              onChange={handleChange}
            />

            <Input
              label="Model (Optional)"
              name="model"
              placeholder="e.g. Galaxy A54, Civic 2022"
              value={formData.model}
              onChange={handleChange}
            />

            <div className="sm:col-span-2">
              <Input
                label="Color (Optional)"
                name="color"
                placeholder="e.g. Midnight Black, Silver, Navy Blue"
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
                placeholder="Describe the item you found in detail..."
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
                placeholder="Black cover, small scratch on the back, sticker near the camera..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
              <p className="text-xs text-slate-400 mt-1">
                Do not publicly reveal confidential PINs or serial numbers so ownership can be verified legitimately.
              </p>
            </div>
          </div>
        </div>

        {/* Section B — Item Photos */}
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Section B — Item Photos
            </h2>
            <p className="text-xs text-slate-500">
              Upload clear photos of the found item (up to 5 photos, JPG, PNG, WEBP max 5MB).
            </p>
          </div>

          <ImageUploader
            images={uploadedPhotos}
            onImagesChange={setUploadedPhotos}
            maxFiles={5}
            maxSizeMB={5}
          />
        </div>

        {/* Section C — Where Was It Found? */}
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Section C — Where Was It Found?
            </h2>
            <p className="text-xs text-slate-500">
              Tell the community where you discovered this item in Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Found Date"
              name="foundDate"
              type="date"
              max={todayDateString}
              value={formData.foundDate}
              onChange={handleChange}
              error={errors.foundDate}
              required
              helperText="Future dates are not permitted."
            />

            <Input
              label="Found Time (Optional)"
              name="foundTime"
              type="time"
              value={formData.foundTime}
              onChange={handleChange}
              helperText="Approximate time if known."
            />

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
              placeholder="e.g. Saddar, Gulshan-e-Iqbal, University Road, Hayatabad"
              value={formData.area}
              onChange={handleChange}
              error={errors.area}
              required
            />

            <div className="sm:col-span-2">
              <Input
                label="Found Location Description (Optional)"
                name="locationDescription"
                placeholder="e.g. Found near the entrance of the shopping mall, near ATM machine"
                value={formData.locationDescription}
                onChange={handleChange}
                helperText="Landmark or venue context (do not provide exact private home addresses)."
              />
            </div>
          </div>
        </div>

        {/* Section D — Where is the item currently kept? */}
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Section D — Where is the item currently kept?
            </h2>
            <p className="text-xs text-slate-500">
              Reassure the owner that their item is in safe custody.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Select
                label="Current Location"
                name="currentLocation"
                value={formData.currentLocation}
                onChange={handleChange}
                options={CURRENT_LOCATION_OPTIONS}
                error={errors.currentLocation}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Current Keeping Description (Optional)
              </label>
              <textarea
                name="currentKeepingDescription"
                rows={3}
                value={formData.currentKeepingDescription}
                onChange={handleChange}
                placeholder="e.g. The item is safely stored with me and can be handed over after ownership verification."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
              <p className="text-xs text-slate-400 mt-1">
                Do not expose sensitive personal addresses publicly.
              </p>
            </div>
          </div>
        </div>

        {/* Form Submission Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Saved securely to the REUNIVO registry.</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8"
          >
            {isSubmitting ? 'Submitting...' : 'Report Found Item'}
          </Button>
        </div>
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleFinishSuccess}
        title="Found Item Reported Successfully!"
        subtitle="Thank you for helping someone recover their lost item."
      >
        <div className="space-y-4 text-center">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Civic Report Registered!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Your found report for <span className="font-semibold text-slate-900">“{createdReport?.title}”</span> has been added to REUNIVO. Thank you for your kindness and civic responsibility.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-600 space-y-1 text-left font-mono">
            <div><strong>Report ID:</strong> {createdReport?._id}</div>
            <div><strong>Status:</strong> {createdReport?.status}</div>
            <div><strong>City:</strong> {createdReport?.city} ({createdReport?.area})</div>
            <div><strong>Custody:</strong> {createdReport?.currentLocation}</div>
            <div><strong>Photos:</strong> {createdReport?.photos?.length || 0} attached</div>
          </div>
          <div className="pt-3">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleFinishSuccess}
            >
              View My Found Reports in Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportFoundPage;
