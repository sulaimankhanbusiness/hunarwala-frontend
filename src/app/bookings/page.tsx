'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { bookingApi } from '@/features/bookings/api/booking.api';
import { Booking } from '@/features/bookings/types/booking.types';
import { BookingCard } from '@/features/bookings/components/BookingCard';
import { Loader2, Briefcase, User as UserIcon, CalendarDays, Plus } from 'lucide-react';
import Link from 'next/link';

export default function MyBookingsPage() {
    const { user, isAuthenticated } = useAuthStore();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'client' | 'helper'>('client');

    const fetchBookings = async (roleType: 'client' | 'helper' = activeTab) => {
        try {
            console.log('Fetching bookings for role:', roleType);
            setLoading(true);
            const data = await bookingApi.getMyBookings(roleType);
            console.log('Bookings received:', data.length, data);
            setBookings(data);
        } catch (err) {
            console.error('Failed to fetch bookings', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchBookings(activeTab);
        }
    }, [isAuthenticated, activeTab]);

    // Initial tab based on user type if possible
    useEffect(() => {
        if (user?.userType === 'helper') {
            setActiveTab('helper');
        }
    }, [user]);

    const filteredBookings = bookings;

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="bg-blue-50 p-6 rounded-full">
                    <UserIcon className="w-12 h-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold">Please log in to see your bookings</h2>
                <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-100">
                    Login Now
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 pb-24">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        <CalendarDays className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Job Center</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900">My Bookings</h1>
                    <p className="text-gray-500 font-medium">Manage your service requests and work schedule in one place.</p>
                </div>

                <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 self-start">
                    <button
                        onClick={() => setActiveTab('client')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'client'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <UserIcon className="w-4 h-4" /> As Client
                    </button>
                    {user?.userType === 'helper' && (
                        <button
                            onClick={() => setActiveTab('helper')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'helper'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <Briefcase className="w-4 h-4" /> As Helper
                        </button>
                    )}
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
                    <div className="relative">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                        </div>
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading bookings...</p>
                </div>
            ) : filteredBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    {filteredBookings.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            role={activeTab}
                            onUpdate={fetchBookings}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-16 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                        <CalendarDays className="w-10 h-10 text-gray-300" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900">No {activeTab} bookings found</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">
                            {activeTab === 'client'
                                ? "You haven't booked any service yet. Browse helpers to get started!"
                                : "You haven't received any service requests yet. Keep your profile updated!"}
                        </p>
                    </div>
                    {activeTab === 'client' && (
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all hover:scale-105"
                        >
                            <Plus className="w-5 h-5" /> Find Helpers
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
