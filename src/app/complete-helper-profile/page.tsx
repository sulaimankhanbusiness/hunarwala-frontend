'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { registerAsHelper } from '@/features/helpers/services/helpers.service';
import { refreshToken } from '@/features/auth/services/auth.service';
import ProfessionalInfo from '@/features/helpers/components/ProfessionalInfo';
import ServiceLocationInfo from '@/features/helpers/components/ServiceLocationInfo';
import DocumentsInfo from '@/features/helpers/components/DocumentsInfo';

type Step = 'professional' | 'location' | 'documents';

const STEPS: { key: Step; label: string }[] = [
  { key: 'professional', label: 'Skills'   },
  { key: 'location',     label: 'Location' },
  { key: 'documents',    label: 'Docs'     },
];

export default function CompleteHelperProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, _hasHydrated, setAuth } = useAuthStore();

  const [step, setStep]                 = useState<Step>('professional');
  const [professionalData, setProfData] = useState<any>(null);
  const [locationData, setLocData]      = useState<any>(null);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState('');

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) router.replace('/login');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated]);

  const onDocumentsSubmit = async (docsData: { profilePicture?: File; cnicFront?: File; cnicBack?: File }) => {
    if (!user) return;
    setIsLoading(true);
    setError('');
    try {
      await registerAsHelper({
        userId: user.id,
        ...professionalData,
        ...locationData,
        ...docsData,
      });

      // Re-issue JWT so it reflects the new userType:'helper' and helperId from DB
      const fresh = await refreshToken();
      setAuth(fresh.user, fresh.accessToken);

      router.replace('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not save your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={36} />
      </div>
    );
  }

  const currentIdx = STEPS.findIndex(s => s.key === step);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        <div className="text-center mb-7">
          <span className="text-3xl font-black text-indigo-600 tracking-tighter">
            HunarWalaa<span className="text-amber-500">.</span>
          </span>
          <p className="text-sm text-gray-400 mt-1">Complete your helper profile</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 relative overflow-hidden">

          {/* Progress stepper */}
          <div className="mb-9 flex justify-between items-center max-w-xs mx-auto relative px-4">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 mx-8" />
            <div className={`absolute top-4 left-0 h-0.5 bg-indigo-500 transition-all duration-500 mx-8 ${
              step === 'professional' ? 'w-0' :
              step === 'location'     ? 'w-1/2' : 'w-full'
            }`} />
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex flex-col items-center gap-1 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  s.key === step ? 'bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-100' :
                  i < currentIdx ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  <span className="text-xs font-bold">{i + 1}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-tight ${
                  s.key === step ? 'text-indigo-600' : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl">
              {error}
            </div>
          )}

          {step === 'professional' && (
            <ProfessionalInfo
              onNext={(data) => { setProfData(data); setStep('location'); }}
              onBack={() => router.replace('/choose-role')}
              initialData={professionalData}
            />
          )}

          {step === 'location' && (
            <ServiceLocationInfo
              onSubmit={(data) => { setLocData(data); setStep('documents'); }}
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

          {isLoading && (
            <div className="absolute inset-0 bg-white/80 rounded-3xl flex items-center justify-center z-10">
              <Loader2 className="animate-spin text-indigo-600" size={36} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
