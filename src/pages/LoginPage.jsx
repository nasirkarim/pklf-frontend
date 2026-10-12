import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { ReunivoEmblem } from '../components/ReunivoLogo';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to dashboard or redirect origin
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Please enter your registered email address';
    }
    if (!password) {
      newErrors.password = 'Please enter your password';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-10 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <ReunivoEmblem className="w-14 h-14 rounded-2xl mx-auto shadow-md border border-emerald-900/30" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Sign in to manage your lost/found reports and track verification claims.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Server Error Alert */}
        {serverError && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Sign In Failed</span>
              <span>{serverError}</span>
            </div>
          </div>
        )}

        {/* Redirect Notice if routed from Protected Page */}
        {location.state?.from && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
            Please log in to access this protected citizen portal page.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="e.g. name@domain.pk"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              if (serverError) setServerError('');
            }}
            error={errors.email}
            icon={Mail}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your account password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              if (serverError) setServerError('');
            }}
            error={errors.password}
            icon={Lock}
            required
          />

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded-md border-slate-300 text-emerald-700 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
              <span>Remember me</span>
            </label>

            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="font-semibold text-emerald-800 hover:text-emerald-900 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="mt-2"
          >
            Sign In to Account
          </Button>
        </form>

        <div className="pt-3 border-t border-slate-100 text-center">
          <span className="text-[11px] text-slate-500 font-medium">
            🔒 Protected by 256-bit SSL &amp; JWT Session Encryption
          </span>
        </div>
      </div>

      {/* Switch to Register */}
      <div className="text-center text-xs sm:text-sm text-slate-600">
        Don&apos;t have an account yet?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="font-bold text-emerald-800 hover:text-emerald-900 hover:underline"
        >
          Create free citizen account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
