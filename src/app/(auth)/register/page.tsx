'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { register as registerApi } from '@/features/auth/services/auth.service';
import { registerAsHelper } from '@/features/helpers/services/helper.service';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useState, useEffect, Suspense } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle, User, Briefcase, MapPin } from 'lucide-react';
import ProfessionalInfo from '@/features/helpers/components/ProfessionalInfo';
import ServiceLocationInfo from '@/features/helpers/components/ServiceLocationInfo';

type Step = 'account' | 'professional' | 'location';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore(state => state.setAuth);

  const [step, setStep] = useState<Step>('account');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState<'client' | 'helper'>('client');

  // Storage for multi-step data
  const [accountData, setAccountData] = useState<any>(null);
  const [professionalData, setProfessionalData] = useState<any>(null);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'helper') setUserType('helper');
    if (type === 'client') setUserType('client');
  }, [searchParams]);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onAccountSubmit = async (data: any) => {
    // Store account data locally without calling API yet
    // This prevents "Email already exists" errors if user backtracks
    setAccountData({ ...data, userType });

    if (userType === 'helper') {
      setStep('professional');
    } else {
      // For clients, register immediately since there are no additional steps
      setIsLoading(true);
      setError('');
      try {
        const res = await registerApi({ ...data, userType });
        setAuth(res.user, res.accessToken);
        router.push('/');
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

  const onLocationSubmit = async (locationData: any) => {
    setIsLoading(true);
    setError('');
    try {
      // Step 1: Register the user account first
      const authRes = await registerApi(accountData);

      // Step 2: Set authentication to get token for helper registration
      setAuth(authRes.user, authRes.accessToken);

      // Step 3: Register as helper with professional and location data
      const finalHelperDto = {
        userId: authRes.user.id,
        ...professionalData,
        ...locationData
      };
      await registerAsHelper(finalHelperDto);

      // Registration complete!
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIcon = (s: Step, label: string, icon: any) => {
    const isActive = step === s;
    const isPast = (step === 'professional' && s === 'account') ||
      (step === 'location' && (s === 'account' || s === 'professional'));

    return (
      <div className="flex flex-col items-center gap-1 relative z-10">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-100' :
          isPast ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
          }`}>
          {isPast ? <CheckCircle size={16} /> : icon}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-tight ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gray-50/50">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100 overflow-hidden relative">

        {/* Progress Stepper (Only for Helpers) */}
        {userType === 'helper' && (
          <div className="mb-10 flex justify-between items-center max-w-sm mx-auto relative px-4">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 -z-0 mx-8" />
            <div className={`absolute top-4 left-0 h-0.5 bg-blue-500 transition-all duration-500 ease-in-out -z-0 mx-8 ${step === 'professional' ? 'w-1/2' : step === 'location' ? 'w-full' : 'w-0'
              }`} />

            {renderStepIcon('account', 'Account', <User size={16} />)}
            {renderStepIcon('professional', 'Professional', <Briefcase size={16} />)}
            {renderStepIcon('location', 'Location', <MapPin size={16} />)}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl flex items-center justify-center animate-shake">
            {error}
          </div>
        )}

        {step === 'account' && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Join HunarWala</h1>
              <p className="text-gray-500 font-medium">Your platform to find and provide expert services</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setUserType('client')}
                className={`p-5 rounded-2xl border-2 transition-all group flex flex-col items-center gap-3 ${userType === 'client'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                  : 'border-gray-100 hover:border-blue-200 text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${userType === 'client' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100'
                  }`}>
                  <User size={24} />
                </div>
                <div className="text-center">
                  <span className="block font-bold text-sm">I want to Hire</span>
                  <p className="text-[10px] opacity-70">Looking for help</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setUserType('helper')}
                className={`p-5 rounded-2xl border-2 transition-all group flex flex-col items-center gap-3 ${userType === 'helper'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                  : 'border-gray-100 hover:border-blue-200 text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${userType === 'helper' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100'
                  }`}>
                  <Briefcase size={24} />
                </div>
                <div className="text-center">
                  <span className="block font-bold text-sm">I want to Work</span>
                  <p className="text-[10px] opacity-70">Offering services</p>
                </div>
              </button>
            </div>

            <form onSubmit={handleSubmit(onAccountSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    {...register('fullName', { required: 'Name is required' })}
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message as string}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    {...register('phoneNumber', { required: 'Phone is required' })}
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    placeholder="0300 1234567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                  })}
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl shadow-blue-500/30 mt-6 active:scale-[0.98]"
              >
                Continue
              </button>
            </form>
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
            isLoading={isLoading}
          />
        )}

        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold decoration-2 underline-offset-4 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}

