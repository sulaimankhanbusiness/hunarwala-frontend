'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Search, Briefcase, MessageSquare, Wallet,
  MoreHorizontal, X, Info, LogOut, LogIn, UserPlus,
  ChevronRight, Star, Shield,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useNavBadgeStore } from '@/stores/useNavBadgeStore';

/* ── Badge ── */
function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] flex items-center justify-center bg-red-500 text-white text-[9px] font-black rounded-full px-1 ring-2 ring-white leading-none animate-in zoom-in-50 duration-200">
      {count > 9 ? '9+' : count}
    </span>
  );
}

/* ── Single tab button ── */
function Tab({
  href, icon, activeIcon, label, active, badge = 0, onClick,
}: {
  href?: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  const inner = (
    <span className="flex flex-col items-center gap-0.5 w-full py-1.5 px-1">
      <span className="relative flex items-center justify-center">
        {/* Active pill glow behind icon */}
        {active && (
          <span className="absolute inset-0 -m-2 rounded-2xl bg-blue-50 scale-100 transition-all duration-300" />
        )}
        <span className={`relative transition-all duration-200 ${active ? 'scale-110 text-blue-600' : 'scale-100 text-gray-400'}`}>
          {active && activeIcon ? activeIcon : icon}
        </span>
        <Badge count={badge} />
      </span>
      <span className={`text-[10px] font-bold tracking-tight transition-colors duration-200 ${active ? 'text-blue-600' : 'text-gray-400'}`}>
        {label}
      </span>
    </span>
  );

  if (onClick) return <button className="flex-1 flex justify-center active:scale-95 transition-transform" onClick={onClick}>{inner}</button>;
  return <Link href={href!} className="flex-1 flex justify-center active:scale-95 transition-transform">{inner}</Link>;
}

/* ── More menu row item ── */
function DrawerItem({
  icon, label, sub, danger, onClick, iconBg,
}: {
  icon: React.ReactNode; label: string; sub?: string;
  danger?: boolean; onClick: () => void; iconBg: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-colors text-left active:scale-[0.98] ${danger ? 'hover:bg-red-50' : 'hover:bg-gray-50'}`}
    >
      <span className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold leading-tight ${danger ? 'text-red-600' : 'text-gray-900'}`}>{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <ChevronRight size={15} className="text-gray-300 flex-shrink-0" />
    </button>
  );
}

/* ── Main component ── */
export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const unreadMessages = useNavBadgeStore((s) => s.unreadMessages);
  const newBookings    = useNavBadgeStore((s) => s.newBookings);
  const [moreOpen, setMoreOpen] = useState(false);

  const is = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);
  const isHelper = user?.userType === 'helper';

  const go = (href: string) => { setMoreOpen(false); router.push(href); };
  const handleLogout = () => { setMoreOpen(false); logout(); router.push('/'); };

  return (
    <>
      {/* ── Bottom Tab Bar ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-1px_0_rgba(0,0,0,0.04),0_-8px_24px_rgba(0,0,0,0.06)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center px-1">
          <Tab href="/" label="Home" active={is('/')}
            icon={<Home size={22} strokeWidth={1.8} />}
            activeIcon={<Home size={22} strokeWidth={2.5} />} />

          <Tab href="/services" label="Search" active={is('/services')}
            icon={<Search size={22} strokeWidth={1.8} />}
            activeIcon={<Search size={22} strokeWidth={2.5} />} />

          {user && (
            <Tab href="/bookings" label="Bookings" active={is('/bookings')} badge={newBookings}
              icon={<Briefcase size={22} strokeWidth={1.8} />}
              activeIcon={<Briefcase size={22} strokeWidth={2.5} />} />
          )}

          {user && (
            <Tab href="/chats" label="Chats" active={is('/chats')} badge={unreadMessages}
              icon={<MessageSquare size={22} strokeWidth={1.8} />}
              activeIcon={<MessageSquare size={22} strokeWidth={2.5} />} />
          )}

          {isHelper && (
            <Tab href="/wallet" label="Wallet" active={is('/wallet')}
              icon={<Wallet size={22} strokeWidth={1.8} />}
              activeIcon={<Wallet size={22} strokeWidth={2.5} />} />
          )}

          <Tab label="More" active={moreOpen} onClick={() => setMoreOpen(true)}
            icon={<MoreHorizontal size={22} strokeWidth={1.8} />}
            activeIcon={<MoreHorizontal size={22} strokeWidth={2.5} />} />
        </div>
      </nav>

      {/* ── Backdrop ── */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* ── Slide-up Drawer ── */}
      <div
        className={`fixed left-0 right-0 z-[70] md:hidden bg-white rounded-t-[28px] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${moreOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ bottom: 0, paddingBottom: 'calc(env(safe-area-inset-bottom) + 5rem)' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <span className="text-base font-black text-gray-900">Menu</span>
          <button
            onClick={() => setMoreOpen(false)}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 active:scale-95 transition-transform"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* User card */}
        {user && (
          <div className="mx-4 mb-3 p-3.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl flex items-center gap-3 shadow-lg shadow-blue-200">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-base">
              {user.fullName?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight truncate">{user.fullName}</p>
              <p className="text-blue-100 text-xs truncate">{user.email}</p>
            </div>
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-lg capitalize">
              {user.userType}
            </span>
          </div>
        )}

        {/* Items */}
        <div className="px-2 space-y-0.5">

          <DrawerItem onClick={() => go('/how-it-works')}
            iconBg="bg-purple-100" label="How it Works" sub="Learn about our platform"
            icon={<Info size={18} className="text-purple-600" />} />

          <DrawerItem onClick={() => go('/services')}
            iconBg="bg-blue-100" label="All Services" sub="Browse all service categories"
            icon={<Search size={18} className="text-blue-600" />} />

          <DrawerItem onClick={() => go('/services?sort=rating')}
            iconBg="bg-amber-100" label="Top Rated Pros" sub="Highest rated professionals"
            icon={<Star size={18} className="text-amber-500" />} />

          {!user && (
            <>
              <div className="h-px bg-gray-100 mx-4 my-1" />
              <DrawerItem onClick={() => go('/login')}
                iconBg="bg-gray-100" label="Login" sub="Sign in to your account"
                icon={<LogIn size={18} className="text-gray-600" />} />
              <DrawerItem onClick={() => go('/register')}
                iconBg="bg-blue-100" label="Join Free" sub="Create a free account"
                icon={<UserPlus size={18} className="text-blue-600" />} />
              <DrawerItem onClick={() => go('/register?type=helper')}
                iconBg="bg-emerald-100" label="Become a Pro" sub="Start earning on HunarWalaa"
                icon={<Shield size={18} className="text-emerald-600" />} />
            </>
          )}

          {user && (
            <>
              <div className="h-px bg-gray-100 mx-4 my-1" />
              <DrawerItem onClick={handleLogout} danger
                iconBg="bg-red-100" label="Logout" sub="Sign out of your account"
                icon={<LogOut size={18} className="text-red-500" />} />
            </>
          )}
        </div>

        {/* App version footer */}
        <p className="text-center text-[10px] text-gray-300 font-semibold mt-4 pb-1 tracking-wide">
          HUNARWALA · PAKISTAN
        </p>
      </div>
    </>
  );
}
