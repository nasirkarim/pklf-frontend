import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Phone, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { ROUTES, MAJOR_CITIES_PAKISTAN } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import { ReunivoEmblem } from '../components/ReunivoLogo';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
    termsAgreed: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for SMS recovery alerts';
    }
    if (!formData.city) {
      newErrors.city = 'Please select your primary city';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.termsAgreed) {
      newErrors.termsAgreed = 'You must accept the Community Safety Guidelines';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        password: formData.password,
      });
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6 sm:py-10 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <ReunivoEmblem className="w-14 h-14 rounded-2xl mx-auto shadow-md border border-emerald-900/30" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Community Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Join Pakistan’s national network to file reports and facilitate item recovery.
        </p>
      </div>

      {/* Main Register Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {serverError && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Registration Error</span>
              <span>{serverError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="e.g. Muhammad Usman"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            icon={User}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="name@domain.pk"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
              required
            />

            <Input
              label="Mobile Phone Number"
              name="phone"
              placeholder="0300 1234567"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              icon={Phone}
              required
              helperText="Used for SMS ownership alerts."
            />
          </div>

          <Select
            label="Primary City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            options={MAJOR_CITIES_PAKISTAN.filter((c) => c !== 'All Cities')}
            error={errors.city}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={Lock}
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={Lock}
              required
            />
          </div>

          {/* Terms checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
              <input
                type="checkbox"
                name="termsAgreed"
                checked={formData.termsAgreed}
                onChange={handleChange}
                className="rounded-md border-slate-300 text-emerald-700 focus:ring-emerald-500 w-4 h-4 mt-0.5 cursor-pointer"
              />
              <span>
                I agree to the Community Trust Guidelines and understand that false reporting of lost or found belongings is strictly prohibited.
              </span>
            </label>
            {errors.termsAgreed && (
              <p className="text-xs text-rose-600 mt-1 font-medium">
                {errors.termsAgreed}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="mt-3"
          >
            Register Citizen Account
          </Button>
        </form>

        <div className="pt-3 border-t border-slate-100 text-center">
          <span className="text-[11px] text-slate-500 font-medium">
            🔒 Verified Citizen Registration • Private Contact Guarantee
          </span>
        </div>
      </div>

      {/* Switch to Login */}
      <div className="text-center text-xs sm:text-sm text-slate-600">
        Already registered?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-bold text-emerald-800 hover:text-emerald-900 hover:underline"
        >
          Sign in to existing account
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
