import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/auth';
import { Mail, KeyRound, ShieldCheck, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    status,
    userEmail,
    requestOtp,
    verifyOtp,
    isLoading,
    errorMessage,
    clearError,
  } = useAuthStore();

  const [emailInput, setEmailInput] = useState(userEmail || '');
  const [otpCode, setOtpCode] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/shortlist');
    }
  }, [status, navigate]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!emailInput.trim()) return;

    const ok = await requestOtp(emailInput.trim());
    if (ok) {
      setCooldown(60);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (otpCode.length !== 6) return;

    const ok = await verifyOtp(otpCode);
    if (ok) {
      navigate('/shortlist');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto border border-orange-200">
          <Mail className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Sign In with Email OTP
        </h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Passwordless login to save and access your scheme shortlist from any device.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {status === 'otp_sent' ? (
          /* STEP 2: ENTER OTP */
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Enter 6-digit Code sent to <span className="text-slate-900">{userEmail}</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-10 pr-4 py-3 text-xl font-mono tracking-widest text-center bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 font-bold"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length !== 6}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              {isLoading ? 'Verifying...' : 'Verify & Log In'}
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                disabled={cooldown > 0 || isLoading}
                onClick={handleSendEmail}
                className="text-orange-600 hover:text-orange-700 disabled:text-slate-400 font-semibold"
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
              </button>

              <button
                type="button"
                onClick={() => useAuthStore.setState({ status: 'guest' })}
                className="text-slate-500 hover:text-slate-800"
              >
                Change email
              </button>
            </div>
          </form>
        ) : (
          /* STEP 1: ENTER EMAIL */
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !emailInput}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              {isLoading ? 'Sending Code...' : 'Send 6-Digit Code'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Privacy Note */}
        <div className="pt-4 border-t border-slate-100 flex items-start gap-2.5 text-slate-500 text-[11px] leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            We only use your email to save your shortlist. Your profile questionnaire answers never leave this device.
          </span>
        </div>
      </div>
    </div>
  );
};
