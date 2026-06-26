'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { register as registerApi } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { usePendingHelperStore } from '@/features/auth/stores/usePendingHelperStore';
import { useState, useEffect, Suspense } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle, User, Briefcase, MapPin, FileImage } from 'lucide-react';
import { GoogleAuthButton } from '@/components/GoogleAuthButton';
import { fbEvent } from '@/lib/pixel';
import ProfessionalInfo from '@/features/helpers/components/ProfessionalInfo';
import ServiceLocationInfo from '@/features/helpers/components/ServiceLocationInfo';
import DocumentsInfo from '@/features/helpers/components/DocumentsInfo';

type Step = 'account' | 'professional' | 'location' | 'documents';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const { setPendingHelperData } = usePendingHelperStore();

  // Only redirect if already authenticated when the page loaded.
  // Watching isAuthenticated would race with GoogleAuthButton's own redirect.
  useEffect(() => {
    if (_hasHydrated && isAuthenticated) router.replace('/');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated]);

  const [step, setStep] = useState<Step>('account');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState<'client' | 'helper'>('client');

  const [accountData, setAccountData]           = useState<any>(null);
  const [professionalData, setProfessionalData] = useState<any>(null);
  const [locationData, setLocationData]         = useState<any>(null);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'helper') setUserType('helper');
    if (type === 'client') setUserType('client');
  }, [searchParams]);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onAccountSubmit = async (data: any) => {
    setAccountData({ ...data, userType });
    if (userType === 'helper') {
      setStep('professional');
    } else {
      setIsLoading(true);
      setError('');
      try {
        await registerApi({ ...data, userType });
        fbEvent('CompleteRegistration', { content_name: userType });
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onProfessionalSubmit = (data: any) => {
    setProfessionalData(data);
    setStep('location');
  };

  const onLocationSubmit = (data: any) => {
    setLocationData(data);
    setStep('documents');
  };

  const onDocumentsSubmit = async (docsData: { profilePicture?: File; cnicFront?: File; cnicBack?: File }) => {
    setIsLoading(true);
    setError('');
    try {
      // Save helper profile data — completed after email verification
      setPendingHelperData({ professionalData, locationData, docsData });
      await registerApi(accountData);
      fbEvent('CompleteRegistration', { content_name: 'helper' });
      router.push(`/verify-email?email=${encodeURIComponent(accountData.email)}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const STEP_ORDER: Step[] = ['account', 'professional', 'location', 'documents'];

  const renderStepIcon = (s: Step, label: string, icon: React.ReactNode) => {
    const currentIdx = STEP_ORDER.indexOf(step);
    const thisIdx    = STEP_ORDER.indexOf(s);
    const isActive   = step === s;
    const isPast     = thisIdx < currentIdx;

    return (
      <div className="flex flex-col items-center gap-1 relative z-10">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isActive ? 'bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-100' :
          isPast   ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
        }`}>
          {isPast ? <CheckCircle size={16} /> : icon}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-tight ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        {/* Logo */}
        <div className="text-center mb-7">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-black text-indigo-600 tracking-tighter">
              HunarWalaa<span className="text-amber-500">.</span>
            </span>
          </Link>
          <p className="text-sm text-gray-400 mt-1">Pakistan's trusted service marketplace</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 overflow-hidden relative">

          {/* Progress Stepper (helpers only) */}
          {userType === 'helper' && (
            <div className="mb-9 flex justify-between items-center max-w-sm mx-auto relative px-4">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 -z-0 mx-8" />
              <div className={`absolute top-4 left-0 h-0.5 bg-indigo-500 transition-all duration-500 ease-in-out -z-0 mx-8 ${
                step === 'professional' ? 'w-1/3' :
                step === 'location'     ? 'w-2/3' :
                step === 'documents'    ? 'w-full' : 'w-0'
              }`} />
              {renderStepIcon('account',      'Account',  <User size={16} />)}
              {renderStepIcon('professional', 'Pro',      <Briefcase size={16} />)}
              {renderStepIcon('location',     'Location', <MapPin size={16} />)}
              {renderStepIcon('documents',    'Docs',     <FileImage size={16} />)}
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl">
              {error}
            </div>
          )}

          {step === 'account' && (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Join HunarWalaa</h1>
                <p className="text-sm text-gray-500">Your platform to find and provide expert services</p>
              </div>

              {/* User type selector */}
              <div className="grid grid-cols-2 gap-3 mb-7">
                <button
                  type="button"
                  onClick={() => setUserType('client')}
                  className={`p-4 md:p-5 rounded-2xl border-2 transition-all group flex flex-col items-center gap-2.5 ${
                    userType === 'client'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md'
                      : 'border-gray-100 hover:border-indigo-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                    userType === 'client' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-100'
                  }`}>
                    <User size={22} />
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-sm">I want to Hire</span>
                    <p className="text-[10px] opacity-70 mt-0.5">Looking for help</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType('helper')}
                  className={`p-4 md:p-5 rounded-2xl border-2 transition-all group flex flex-col items-center gap-2.5 ${
                    userType === 'helper'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md'
                      : 'border-gray-100 hover:border-indigo-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                    userType === 'helper' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-100'
                  }`}>
                    <Briefcase size={22} />
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-sm">I want to Work</span>
                    <p className="text-[10px] opacity-70 mt-0.5">Offering services</p>
                  </div>
                </button>
              </div>

              <form onSubmit={handleSubmit(onAccountSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <input
                      {...register('fullName', { required: 'Name is required' })}
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-sm"
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message as string}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                    <input
                      {...register('phoneNumber', { required: 'Phone is required' })}
                      type="tel"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-sm"
                      placeholder="0300 1234567"
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message as string}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                    })}
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-sm"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Minimum 6 characters' },
                      })}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:scale-[0.98] mt-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Continue'}
                </button>
              </form>

              <div className="flex items-center gap-3 mt-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium">or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="mt-4">
                <GoogleAuthButton label="Sign up with Google" />
              </div>
            </>
          )}

          {step === 'professional' && (
            <ProfessionalInfo
              onNext={onProfessionalSubmit}
              onBack={() => setStep('account')}
              initialData={professionalData}
            />
          )}

          {step === 'location' && (
            <ServiceLocationInfo
              onSubmit={onLocationSubmit}
              onBack={() => setStep('professional')}
              isLoading={false}
            />
          )}

          {step === 'documents' && (
            <DocumentsInfo
              onNext={onDocumentsSubmit}
              onBack={() => setStep('location')}
            />
          )}

          {isLoading && step === 'documents' && (
            <div className="absolute inset-0 bg-white/80 rounded-3xl flex items-center justify-center z-10">
              <Loader2 className="animate-spin text-indigo-600" size={36} />
            </div>
          )}

          <div className="mt-7 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-bold">
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
