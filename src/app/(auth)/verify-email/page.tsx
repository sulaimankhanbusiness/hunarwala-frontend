'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Loader2, Mail, RefreshCw } from 'lucide-react';
import { verifyEmail, resendOtp } from '@/features/auth/services/auth.service';
import { registerAsHelper } from '@/features/helpers/services/helpers.service';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { usePendingHelperStore } from '@/features/auth/stores/usePendingHelperStore';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const { setAuth } = useAuthStore();
  const { pendingHelperData, clearPendingHelperData } = usePendingHelperStore();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start cooldown on mount so the user can't immediately resend
  useEffect(() => { setCooldown(RESEND_COOLDOWN); }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const focusAt = (index: number) => inputRefs.current[index]?.focus();

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < OTP_LENGTH - 1) focusAt(index + 1);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) focusAt(index - 1);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...digits];
    pasted.split('').forEach((d, i) => { next[i] = d; });
    setDigits(next);
    focusAt(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const onSubmit = useCallback(async () => {
    const otp = digits.join('');
    if (otp.length < OTP_LENGTH) { setError('Please enter the complete 6-digit code.'); return; }

    setIsLoading(true);
    setError('');
    try {
      const response = await verifyEmail(email, otp);

      // If this was a helper registration, complete the profile now that we have a token
      if (pendingHelperData) {
        try {
          await registerAsHelper({ userId: response.user.id, ...pendingHelperData.professionalData, ...pendingHelperData.locationData, ...pendingHelperData.docsData });
        } catch {
          // Helper profile creation failed — user is still verified, they can retry later
        }
        clearPendingHelperData();
      }

      setAuth(response.user, response.accessToken);
      router.replace('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired code. Please try again.');
      setDigits(Array(OTP_LENGTH).fill(''));
      focusAt(0);
    } finally {
      setIsLoading(false);
    }
  }, [digits, email, pendingHelperData]);

  const onResend = async () => {
    if (cooldown > 0) return;
    setError('');
    try {
      await resendOtp(email);
      setCooldown(RESEND_COOLDOWN);
      setDigits(Array(OTP_LENGTH).fill(''));
      focusAt(0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-black text-indigo-600 tracking-tighter">
            HunarWalaa<span className="text-amber-500">.</span>
          </span>
          <p className="text-sm text-gray-400 mt-1">Pakistan's trusted service marketplace</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-7 md:p-9">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
              <Mail className="text-indigo-600" size={28} />
            </div>
          </div>

          <div className="text-center mb-7">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Check your email</h1>
            <p className="text-sm text-gray-500">
              We sent a 6-digit code to
            </p>
            <p className="text-sm font-semibold text-indigo-600 mt-0.5">{email}</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* OTP boxes */}
          <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-11 h-13 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900"
                style={{ height: '52px' }}
                autoFocus={i === 0}
              />
            ))}
          </div>

          <button
            onClick={onSubmit}
            disabled={isLoading || digits.join('').length < OTP_LENGTH}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Verify Email'}
          </button>

          {/* Resend */}
          <div className="mt-5 text-center">
            <p className="text-sm text-gray-500">Didn't receive the code?</p>
            <button
              onClick={onResend}
              disabled={cooldown > 0}
              className="mt-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1.5 mx-auto transition-colors"
            >
              <RefreshCw size={14} />
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Wrong email?{' '}
          <a href="/register" className="text-indigo-600 font-semibold hover:underline">
            Go back
          </a>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
