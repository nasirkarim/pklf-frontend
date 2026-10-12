import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Users,
  Shield,
  AlertCircle,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowLeft,
  HeartHandshake,
  FileText,
  User,
  Phone,
} from 'lucide-react';
import { PAKISTANI_CITIES } from '../utils/categories';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import missingPersonService from '../services/missingPersonService';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ImageUploader from '../components/ImageUploader';

export const ReportPersonPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Restrict last seen date to today or earlier
  const todayDateString = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'UNKNOWN',
    lastSeenCity: '',
    lastSeenArea: '',
    lastSeenDate: '',
    lastSeenTime: '',
    clothingDescription: '',
    identifyingFeatures: '',
    additionalInformation: '',
    reporterName: '',
    reporterContact: '',
    confirmedAccuracy: false,
  });

  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCase, setCreatedCase] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Pre-fill reporter information from logged-in citizen profile
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        reporterName: prev.reporterName || user.name || '',
        reporterContact: prev.reporterContact || user.phone || user.email || '',
        lastSeenCity: prev.lastSeenCity || (user.city && user.city !== 'All Cities' ? user.city : ''),
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};

    // 1. Person Information
    if (!formData.name.trim()) {
      newErrors.name = 'Full name of missing person is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (formData.age !== '') {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
        newErrors.age = 'Please enter a valid age between 0 and 150';
      }
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select a gender option';
    }

    // 2. Last Seen Information
    if (!formData.lastSeenCity) {
      newErrors.lastSeenCity = 'Please select the city where the person was last seen';
    }

    if (!formData.lastSeenArea.trim()) {
      newErrors.lastSeenArea = 'Area / neighborhood is required (e.g. Saddar, Gulberg, F-7)';
    }

    if (!formData.lastSeenDate) {
      newErrors.lastSeenDate = 'Last seen date is required';
    } else {
      const selected = new Date(formData.lastSeenDate);
      const today = new Date();
      if (selected > today) {
        newErrors.lastSeenDate = 'Last seen date cannot be in the future';
      }
    }

    // 3. Reporter Information
    if (!formData.reporterName.trim()) {
      newErrors.reporterName = 'Reporter name is required';
    }

    if (!formData.reporterContact.trim()) {
      newErrors.reporterContact = 'Contact phone number or email is required';
    } else if (formData.reporterContact.trim().length < 5) {
      newErrors.reporterContact = 'Please enter a valid phone number or email';
    }

    // 4. Confirmation Checkbox
    if (!formData.confirmedAccuracy) {
      newErrors.confirmedAccuracy = 'You must confirm that the provided information is accurate';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Check authentication
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

    // Prevent accidental double clicks
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      if (formData.age !== '') {
        submitData.append('age', formData.age);
      }
      submitData.append('gender', formData.gender);
      submitData.append('lastSeenCity', formData.lastSeenCity);
      submitData.append('lastSeenArea', formData.lastSeenArea.trim());
      submitData.append('lastSeenDate', formData.lastSeenDate);
      submitData.append('lastSeenTime', formData.lastSeenTime.trim());
      submitData.append('clothingDescription', formData.clothingDescription.trim());
      submitData.append('identifyingFeatures', formData.identifyingFeatures.trim());
      submitData.append('additionalInformation', formData.additionalInformation.trim());
      submitData.append('reporterName', formData.reporterName.trim());
      submitData.append('reporterContact', formData.reporterContact.trim());

      // Append selected photos
      uploadedPhotos.forEach((item) => {
        if (item.file) {
          submitData.append('photos', item.file);
        }
      });

      const res = await missingPersonService.createMissingPerson(submitData);

      if (res?.success && res?.missingPerson) {
        setCreatedCase(res.missingPerson);
        setShowSuccessModal(true);
      } else {
        throw new Error(res?.message || 'Failed to submit missing person report');
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
    navigate(ROUTES.FIND_REUNITE);
  };

  const handleResetForm = () => {
    setShowSuccessModal(false);
    setCreatedCase(null);
    setFormData({
      name: '',
      age: '',
      gender: 'UNKNOWN',
      lastSeenCity: '',
      lastSeenArea: '',
      lastSeenDate: '',
      lastSeenTime: '',
      clothingDescription: '',
      identifyingFeatures: '',
      additionalInformation: '',
      reporterName: user?.name || '',
      reporterContact: user?.phone || user?.email || '',
      confirmedAccuracy: false,
    });
    setUploadedPhotos([]);
    setErrors({});
    setServerError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Back Link */}
      <div>
        <Link
          to={ROUTES.FIND_REUNITE}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Find &amp; Reunite</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Find &amp; Reunite Module</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Report a Missing Person
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Please provide accurate and detailed information to assist families and community members. Your contact information is strictly protected and will never be shown on public listings.
          </p>
        </div>
      </div>

      {/* Advisory & Privacy Reassurance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-xl shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="text-xs text-rose-900 leading-relaxed space-y-1">
            <span className="font-bold block">First Response Notice:</span>
            <span>If an individual or minor is missing, please contact local police (dial <strong>15</strong>) to register an official report immediately. This platform supplements community efforts.</span>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl shrink-0">
            <Lock className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-xs text-emerald-950 leading-relaxed space-y-1">
            <span className="font-bold block">Privacy Guaranteed:</span>
            <span>Your personal phone number and contact details are stored under restricted security permissions and are never exposed in public searches or APIs.</span>
          </div>
        </div>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* Section 1: Person Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">1. Person Information</h2>
              <p className="text-xs text-slate-500">Essential identifying demographics of the missing individual</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Full Name of Missing Person"
                id="name"
                name="name"
                placeholder="e.g. Muhammad Usman, Ayesha Bibi"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
            </div>

            <div>
              <Input
                label="Estimated Age (Years)"
                id="age"
                name="age"
                type="number"
                min="0"
                max="150"
                placeholder="e.g. 24"
                value={formData.age}
                onChange={handleChange}
                error={errors.age}
                helperText="Leave empty if age is uncertain"
              />
            </div>

            <div>
              <Select
                label="Gender"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                error={errors.gender}
                options={[
                  { value: 'MALE', label: 'Male' },
                  { value: 'FEMALE', label: 'Female' },
                  { value: 'OTHER', label: 'Other' },
                  { value: 'UNKNOWN', label: 'Unknown / Not Specified' },
                ]}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Photo Upload */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">2. Photo / Portrait (Recommended)</h2>
              <p className="text-xs text-slate-500">A clear, recent photograph significantly improves recognition</p>
            </div>
          </div>

          <ImageUploader
            images={uploadedPhotos}
            onImagesChange={setUploadedPhotos}
            maxFiles={3}
            maxSizeMB={5}
          />
        </div>

        {/* Section 3: Last Seen Information */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">3. Last Seen Information</h2>
              <p className="text-xs text-slate-500">Location and timeline when the person was last spotted</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Select
                label="City"
                id="lastSeenCity"
                name="lastSeenCity"
                value={formData.lastSeenCity}
                onChange={handleChange}
                error={errors.lastSeenCity}
                options={PAKISTANI_CITIES.map((c) => ({ value: c, label: c }))}
                placeholder="Select city"
                required
              />
            </div>

            <div>
              <Input
                label="Area / Neighborhood / Landmark"
                id="lastSeenArea"
                name="lastSeenArea"
                placeholder="e.g. Saddar Market, Gulberg III, Near Metro Station"
                value={formData.lastSeenArea}
                onChange={handleChange}
                error={errors.lastSeenArea}
                required
              />
            </div>

            <div>
              <Input
                label="Last Seen Date"
                id="lastSeenDate"
                name="lastSeenDate"
                type="date"
                max={todayDateString}
                value={formData.lastSeenDate}
                onChange={handleChange}
                error={errors.lastSeenDate}
                required
              />
            </div>

            <div>
              <Input
                label="Last Seen Time (Optional)"
                id="lastSeenTime"
                name="lastSeenTime"
                type="time"
                value={formData.lastSeenTime}
                onChange={handleChange}
                error={errors.lastSeenTime}
                helperText="Approximate time of disappearance"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Physical Description & Distinguishing Features */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">4. Physical Description &amp; Details</h2>
              <p className="text-xs text-slate-500">Clothing, distinguishing marks, and contextual information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="clothingDescription"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Clothing Description
              </label>
              <textarea
                id="clothingDescription"
                name="clothingDescription"
                rows={2}
                placeholder="e.g. Blue shalwar kameez, black sandals, grey shawl..."
                value={formData.clothingDescription}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </div>

            <div>
              <label
                htmlFor="identifyingFeatures"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Distinguishing Marks &amp; Features
              </label>
              <textarea
                id="identifyingFeatures"
                name="identifyingFeatures"
                rows={2}
                placeholder="e.g. Scar on right forehead, wears glasses, mole on left cheek, speech impediment..."
                value={formData.identifyingFeatures}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </div>

            <div>
              <label
                htmlFor="additionalInformation"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Additional Context / Remarks
              </label>
              <textarea
                id="additionalInformation"
                name="additionalInformation"
                rows={3}
                placeholder="Any further background, medical conditions (e.g. memory loss, diabetes), or circumstances..."
                value={formData.additionalInformation}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Reporter Contact Information (Protected) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">5. Your Information (Reporter)</h2>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-700" />
                  Protected
                </span>
              </div>
              <p className="text-xs text-slate-500">Contact details for verification; never published to public searchers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Your Name (Reporter)"
                id="reporterName"
                name="reporterName"
                placeholder="e.g. Tariq Mehmood"
                value={formData.reporterName}
                onChange={handleChange}
                error={errors.reporterName}
                required
              />
            </div>

            <div>
              <Input
                label="Your Contact Phone / Mobile"
                id="reporterContact"
                name="reporterContact"
                placeholder="e.g. 0300-1234567"
                value={formData.reporterContact}
                onChange={handleChange}
                error={errors.reporterContact}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 6: Confirmation Checkbox */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="confirmedAccuracy"
              name="confirmedAccuracy"
              checked={formData.confirmedAccuracy}
              onChange={handleChange}
              className="mt-1 w-4 h-4 rounded-sm text-emerald-700 border-slate-300 focus:ring-emerald-500 focus:ring-offset-0"
            />
            <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              I confirm that the information I have provided is accurate and authentic to the best of my knowledge, and I understand this report will be displayed to assist community reunification efforts.
            </span>
          </label>
          {errors.confirmedAccuracy && (
            <p className="text-xs text-rose-600 font-medium flex items-center gap-1 pl-7">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.confirmedAccuracy}</span>
            </p>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <Link
            to={ROUTES.FIND_REUNITE}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 text-center transition"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full sm:w-auto shadow-md"
          >
            Submit Missing Person Report
          </Button>
        </div>
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleFinishSuccess}
        title="Report Submitted Successfully"
        size="md"
      >
        <div className="space-y-6 text-center py-2">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">
              Missing Person Record Created
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Your inquiry has been successfully registered with <strong>ACTIVE</strong> status in the Find &amp; Reunite registry.
            </p>
          </div>

          {createdCase && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Case Reference ID:</span>
                <span className="font-mono font-bold text-emerald-800">
                  {(createdCase._id || createdCase.id || '').substring(0, 10).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Name:</span>
                <span className="font-bold text-slate-800">{createdCase.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Location:</span>
                <span className="font-medium text-slate-800">
                  {createdCase.lastSeenArea ? `${createdCase.lastSeenArea}, ` : ''}{createdCase.lastSeenCity}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold text-emerald-700">{createdCase.status || 'ACTIVE'}</span>
              </div>
            </div>
          )}

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed text-left flex items-start gap-2">
            <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              Your contact details remain confidential. If any community member spots this individual, verification will proceed through platform protocols.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={handleResetForm}
              className="flex-1"
            >
              Report Another Person
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleFinishSuccess}
              className="flex-1"
            >
              View in Directory
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportPersonPage;
