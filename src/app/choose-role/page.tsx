'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Briefcase, User, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

type Role = 'client' | 'helper';

const ROLES: { key: Role; title: string; desc: string; Icon: React.ElementType }[] = [
  { key: 'client', title: 'I want to Hire',  desc: 'Find skilled professionals', Icon: User },
  { key: 'helper', title: 'I want to Work',  desc: 'Offer your services',         Icon: Briefcase },
];

export default function ChooseRolePage() {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const [selected, setSelected] = useState<Role | null>(null);

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) router.replace('/login');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated]);

  const onContinue = () => {
    if (selected === 'helper') {
      router.push('/complete-helper-profile');
    } else {
      router.replace('/');
    }
  };

  // Show spinner while Zustand rehydrates from localStorage
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={36} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <span className="text-3xl font-black text-indigo-600 tracking-tighter">
            HunarWalaa<span className="text-amber-500">.</span>
          </span>
          <p className="text-sm text-gray-400 mt-1">Pakistan's trusted service marketplace</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-7 md:p-9">

          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
              How will you use HunarWalaa?
            </h1>
            <p className="text-sm text-gray-500">You can always change this later from your profile.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-7">
            {ROLES.map(({ key, title, desc, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                  selected === key
                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                    : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  selected === key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Icon size={24} />
                </div>
                <div className="text-center">
                  <span className={`block font-bold text-sm ${
                    selected === key ? 'text-indigo-700' : 'text-gray-700'
                  }`}>
                    {title}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={onContinue}
            disabled={!selected}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
          >
            Continue
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
