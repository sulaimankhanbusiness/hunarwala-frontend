'use client';

import { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { NotificationCenter } from '../NotificationCenter';
import { useWallet } from '@/features/wallet/hooks/useWallet';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
      {initials}
    </div>
  );
}

export default function MobileHeader() {
  const { user } = useAuthStore();
  const isHelper = user?.userType === 'helper';
  const { data: wallet } = useWallet({ enabled: isHelper });
  const greeting = useMemo(() => getGreeting(), []);
  const firstName = user?.fullName?.split(' ')[0];
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setFlipped((f) => !f), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100/80 shadow-sm"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="px-4 h-14 flex items-center justify-between gap-3 overflow-hidden">

        {/* Left — fades between greeting and logo every 3s */}
        <div className="relative flex-1 min-w-0 h-10 overflow-hidden">

          {/* Greeting */}
          <div className={`absolute inset-0 flex items-center transition-opacity duration-700 ease-in-out ${flipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {user ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar name={user.fullName} />
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-400 leading-none mb-0.5">{greeting}</p>
                  <p className="text-sm font-bold text-gray-900 leading-none truncate">{firstName} 👋</p>
                </div>
              </div>
            ) : (
              <Link href="/" className="flex flex-col leading-none">
                <span className="text-lg font-black text-blue-600 tracking-tighter">
                  HunarWala<span className="text-amber-500">.</span>
                </span>
                <span className="text-[9px] font-semibold text-gray-400 text-right" style={{ fontFamily: 'var(--font-urdu)', direction: 'rtl' }}>
                  ہنروالا
                </span>
              </Link>
            )}
          </div>

          {/* Logo */}
          <div className={`absolute inset-0 flex items-center transition-opacity duration-700 ease-in-out ${flipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <Link href="/" className="flex flex-col leading-none">
              <span className="text-lg font-black text-blue-600 tracking-tighter">
                HunarWala<span className="text-amber-500">.</span>
              </span>
              <span className="text-[9px] font-semibold text-gray-400 text-right" style={{ fontFamily: 'var(--font-urdu)', direction: 'rtl' }}>
                ہنروالا
              </span>
            </Link>
          </div>
        </div>

        {/* Right — always visible */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isHelper && wallet && (
            <Link href="/wallet" className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              <span className="text-[11px] font-bold text-emerald-700">
                ₨ {wallet.balance.toLocaleString()}
              </span>
            </Link>
          )}
          {user && <NotificationCenter />}
          {!user && (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-xs font-semibold text-gray-600 px-3 py-1.5 rounded-full border border-gray-200">
                Login
              </Link>
              <Link href="/register" className="text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-full shadow-sm shadow-blue-200">
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
