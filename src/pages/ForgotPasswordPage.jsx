import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '../utils/constants';
import Input from '../components/Input';
import Button from '../components/Button';

export const ForgotPasswordPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your registered email or phone number');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Reset Password
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Enter your registered email address or mobile phone to receive account recovery instructions.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {isSubmitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Reset Link Prepared
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              If an account is associated with <span className="font-semibold text-slate-800">{identifier}</span>, password reset instructions and a verification code will be dispatched shortly.
            </p>
            <div className="pt-2">
              <Link to={ROUTES.LOGIN}>
                <Button variant="primary" size="md" fullWidth>
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email or Mobile Phone"
              name="identifier"
              placeholder="e.g. name@domain.pk or 03001234567"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (error) setError('');
              }}
              error={error}
              icon={Mail}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="mt-2"
            >
              Send Recovery Instructions
            </Button>
          </form>
        )}

        <div className="pt-3 border-t border-slate-100 text-center">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
