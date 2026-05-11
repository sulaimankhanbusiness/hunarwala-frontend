'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useBookings } from '@/features/bookings/hooks/useBookings';
import { BookingCard } from '@/features/bookings/components/BookingCard';
import { BookingStatus } from '@/features/bookings/types/booking.types';
import {
  Loader2, Briefcase, User as UserIcon, CalendarDays,
  LayoutGrid, List, Search, Filter, Shield,
  MessageSquare, Lock, Plus,
} from 'lucide-react';
import Link from 'next/link';
import { useNavBadgeStore } from '@/stores/useNavBadgeStore';

const TRUST_ITEMS = [
  { icon: Shield,        label: 'Verified Professionals', desc: 'All helpers are background checked & verified' },
  { icon: MessageSquare, label: 'Chat Before Hiring',      desc: 'Discuss requirements before confirming'         },
//   { icon: Lock,          label: 'Secure Payments',         desc: 'Your payments are safe and protected'           },
  { icon: CalendarDays,  label: '24/7 Support',            desc: "We're here to help you anytime"                 },
];

const STATUS_OPTIONS = [
  { value: '',                          label: 'All Status'   },
  { value: BookingStatus.PENDING,       label: 'Pending'      },
  { value: BookingStatus.ACCEPTED,      label: 'Accepted'     },
  { value: BookingStatus.IN_PROGRESS,   label: 'In Progress'  },
  { value: BookingStatus.COMPLETED,     label: 'Completed'    },
  { value: BookingStatus.SETTLED,       label: 'Settled'      },
  { value: BookingStatus.CANCELLED,     label: 'Cancelled'    },
  { value: BookingStatus.DISPUTE,       label: 'Dispute'      },
  { value: BookingStatus.EXPIRED,       label: 'Expired'      },
];

export default function MyBookingsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab,   setActiveTab]   = useState<'client' | 'helper'>('client');
  const [viewMode,    setViewMode]    = useState<'grid' | 'list'>('list');
  const [search,      setSearch]      = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const clearBookings = useNavBadgeStore((s) => s.clearBookings);

  const { data: clientBookings = [], isLoading: loadingClient, refetch: refetchClient } = useBookings('client');
  const { data: helperBookings = [], isLoading: loadingHelper, refetch: refetchHelper } = useBookings('helper');

  const bookings  = activeTab === 'client' ? clientBookings : helperBookings;
  const isLoading = activeTab === 'client' ? loadingClient : loadingHelper;
  const refetch   = activeTab === 'client' ? refetchClient : refetchHelper;

  useEffect(() => { clearBookings(); }, [clearBookings]);
  useEffect(() => {
    if (user?.userType === 'helper') setActiveTab('helper');
  }, [user]);

  const filtered = useMemo(() => {
    let list = bookings;
    if (statusFilter) list = list.filter((b) => b.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((b) =>
        b.serviceDescription?.toLowerCase().includes(q) ||
        (activeTab === 'client'
          ? b.helper?.user?.fullName?.toLowerCase().includes(q)
          : b.user?.fullName?.toLowerCase().includes(q))
      );
    }
    return list;
  }, [bookings, search, statusFilter, activeTab]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4">
        <div className="bg-indigo-50 p-6 rounded-full">
          <UserIcon className="w-12 h-12 text-indigo-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sign in to see your bookings</h2>
        <Link href="/login" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-16">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-3">
              <CalendarDays className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[11px] font-black text-indigo-700 uppercase tracking-widest">Job Center</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900">My Bookings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your service requests and work schedule in one place.</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View toggle */}
            <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Role tabs */}
            <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm gap-1">
              <button
                onClick={() => setActiveTab('client')}
                className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'client'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                As Client
                {clientBookings.length > 0 && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                    activeTab === 'client' ? 'bg-white/25 text-white' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {clientBookings.length}
                  </span>
                )}
              </button>
              {user?.userType === 'helper' && (
                <button
                  onClick={() => setActiveTab('helper')}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'helper'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  As Helper
                  {helperBookings.length > 0 && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                      activeTab === 'helper' ? 'bg-white/25 text-white' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      {helperBookings.length}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Search & Filter bar ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bookings by name or service..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all cursor-pointer"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <p className="text-sm font-semibold text-gray-400">Loading bookings...</p>
          </div>

        ) : filtered.length > 0 ? (
          <>
            <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${
              viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'flex flex-col gap-3'
            }`}>
              {filtered.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  role={activeTab}
                  onUpdate={refetch}
                  viewMode={viewMode}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
              Showing {filtered.length} of {bookings.length} bookings
            </p>
          </>

        ) : (
          <div className="bg-white rounded-3xl p-12 md:p-16 border-2 border-dashed border-gray-100 flex flex-col items-center text-center gap-5">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
              <CalendarDays className="w-9 h-9 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {search || statusFilter ? 'No bookings match your filters' : `No ${activeTab} bookings yet`}
              </h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                {search || statusFilter
                  ? 'Try clearing your search or changing the status filter.'
                  : activeTab === 'client'
                    ? "You haven't booked any service yet. Browse helpers to get started!"
                    : "You haven't received any service requests yet. Keep your profile updated!"}
              </p>
            </div>
            {activeTab === 'client' && !search && !statusFilter && (
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-200"
              >
                <Plus className="w-4 h-4" /> Find Helpers
              </Link>
            )}
          </div>
        )}

        {/* ── Trust strip ─────────────────────────────────────────────────── */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {TRUST_ITEMS.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3 bg-white rounded-2xl p-4 border border-gray-100">
              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800 leading-tight mb-0.5">{label}</p>
                <p className="text-[10px] text-gray-400 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
