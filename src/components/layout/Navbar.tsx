'use client';
import Link from 'next/link';
import { Menu, X, Wallet, CreditCard, MessageSquare, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { NotificationCenter } from '../NotificationCenter';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { useNavBadgeStore } from '@/stores/useNavBadgeStore';
function NavBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 shadow-sm ring-2 ring-white leading-none animate-in fade-in zoom-in duration-200">
      {count > 9 ? '9+' : count}
    </span>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const isHelper = user?.userType === 'helper';
  const { data: wallet } = useWallet({ enabled: isHelper });

  const unreadMessages = useNavBadgeStore((s) => s.unreadMessages);
  const newBookings    = useNavBadgeStore((s) => s.newBookings);

  return (
    <nav className="hidden md:block fixed w-full z-50 glass border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link href="/" className="leading-none group">
            <span className="text-2xl font-bold text-indigo-600 tracking-tighter group-hover:text-indigo-700 transition-colors">
              HunarWalaa<span className="text-amber-500">.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/services"    className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Services</Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">How it Works</Link>

            {user && (
              <>
                <Link href="/bookings" className="relative inline-flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                  <Briefcase size={16} className="text-indigo-400" />
                  My Bookings
                  <NavBadge count={newBookings} />
                </Link>
                <Link href="/chats" className="relative inline-flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                  <MessageSquare size={16} className="text-indigo-400" />
                  Messages
                  <NavBadge count={unreadMessages} />
                </Link>
              </>
            )}

            {user?.userType === 'helper' && (
              <Link href="/wallet" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors flex items-center gap-2">
                <Wallet size={18} className="text-indigo-400" />
                Wallet
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-6">
                <NotificationCenter />
                {user.userType === 'helper' && wallet && (
                  <Link href="/wallet" className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors">
                    <CreditCard size={14} className="text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-700">{wallet.balance.toLocaleString()} PKR</span>
                  </Link>
                )}
                <span className="text-sm font-medium text-gray-700">Hi, {user.fullName.split(' ')[0]}</span>
                <button onClick={logout} className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 font-medium hover:text-indigo-600 transition-colors">Login</Link>
                <Link href="/register" className="px-5 py-2.5 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 hover:shadow-lg">
                  Join Now
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-3">
            {user && (unreadMessages > 0 || newBookings > 0) && (
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link href="/services"     className="block px-3 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" onClick={() => setIsOpen(false)}>Services</Link>
            <Link href="/how-it-works" className="block px-3 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" onClick={() => setIsOpen(false)}>How it Works</Link>

            {user && (
              <>
                <Link href="/bookings" className="flex items-center justify-between px-3 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" onClick={() => setIsOpen(false)}>
                  <span className="flex items-center gap-2"><Briefcase size={18} className="text-indigo-400" />My Bookings</span>
                  {newBookings > 0 && <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">{newBookings > 9 ? '9+' : newBookings} new</span>}
                </Link>
                <Link href="/chats" className="flex items-center justify-between px-3 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" onClick={() => setIsOpen(false)}>
                  <span className="flex items-center gap-2"><MessageSquare size={18} className="text-indigo-400" />Messages</span>
                  {unreadMessages > 0 && <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">{unreadMessages > 9 ? '9+' : unreadMessages} unread</span>}
                </Link>
              </>
            )}

            {user?.userType === 'helper' && (
              <Link href="/wallet" className="block px-3 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" onClick={() => setIsOpen(false)}>
                My Wallet
              </Link>
            )}

            {user ? (
              <>
                <div className="px-3 py-3 text-sm text-gray-500">Signed in as {user.email}</div>
                <button onClick={logout} className="block w-full text-left px-3 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors">Logout</button>
              </>
            ) : (
              <div className="pt-4 flex flex-col gap-3">
                <Link href="/login"    className="block w-full text-center px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">Log In</Link>
                <Link href="/register" className="block w-full text-center px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
