'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Star, Shield, Clock, ArrowLeft, CalendarCheck,
    MessageCircle, Phone, MapPin, Briefcase, CheckCircle2,
    Zap, CreditCard, ThumbsUp, ChevronDown, ChevronUp,
    Award, BadgeCheck, Languages, TrendingUp, Timer,
    Cpu, Search, Sun, Battery, Wrench, X,
} from 'lucide-react';

import { getHelperProfile } from '@/features/helpers/services/helpers.service';
import type { HelperProfile, PortfolioItem, Review } from '@/features/helpers/types/helpers.types';
import { toast } from 'sonner';
import { chatApi } from '@/features/chat/api/chat.api';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { SimpleModal } from '@/components/SimpleModal';
import { BookingForm } from '@/features/bookings/components/BookingForm';
import { fbEvent } from '@/lib/pixel';
import { getMediaUrl } from '@/utils/url';
import ScrollReveal from '@/components/ScrollReveal';

// ─── Service icon map ─────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    zap: Zap, cpu: Cpu, search: Search, sun: Sun, battery: Battery, wrench: Wrench,
};
function SvcIcon({ iconKey, size, className }: { iconKey: string; size?: number; className?: string }) {
    const Icon = ICON_MAP[iconKey] ?? Wrench;
    return <Icon size={size} className={className} />;
}

const DAYS_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    size={size}
                    className={i <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}
                />
            ))}
        </div>
    );
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
    const pct = total ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500 w-3 text-right">{star}</span>
            <Star size={11} className="fill-yellow-400 text-yellow-400 flex-shrink-0" />
            <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-gray-400 text-xs w-8 text-right">{pct}%</span>
        </div>
    );
}

function Lightbox({ items, activeIndex, onClose, onPrev, onNext }: {
    items: PortfolioItem[]; activeIndex: number;
    onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
    const item = items[activeIndex];
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                <X size={22} />
            </button>
            <button onClick={onPrev} className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                <ChevronDown size={20} className="-rotate-90" />
            </button>
            <div className="max-w-3xl w-full">
                <img src={item.imageUrl} alt={item.caption} className="w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl" />
                {item.caption && <p className="text-center text-white/80 mt-4 text-sm font-medium">{item.caption}</p>}
                <p className="text-center text-white/40 text-xs mt-1">{activeIndex + 1} / {items.length}</p>
            </div>
            <button onClick={onNext} className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                <ChevronDown size={20} className="rotate-90" />
            </button>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
    id: string;
    initialHelper: HelperProfile | null;
}

export default function HelperProfileClient({ id, initialHelper }: Props) {
    const router = useRouter();

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [showFullBio, setShowFullBio] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const { data: helper, isLoading, error } = useQuery({
        queryKey: ['helper', id],
        queryFn: () => getHelperProfile(id),
        enabled: !!id,
        initialData: initialHelper ?? undefined,
    });

    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (helper) fbEvent('ViewContent', { content_name: helper.fullName, content_type: 'helper_profile' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [helper?.userId]);

    const handleChatNow = async () => {
        if (!isAuthenticated) { router.push('/login'); return; }
        try {
            const chat = await chatApi.createChat(helper?.userId as string);
            fbEvent('Contact');
            router.push(`/chats?chatId=${chat.id}`);
        } catch {
            toast.error('Could not start chat. Please try again.');
        }
    };

    const handleBookNow = () => {
        if (!isAuthenticated) { router.push('/login'); return; }
        setIsBookingModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    if (error || !helper) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Helper Not Found</h1>
                <p className="text-gray-500 mb-6">This professional does not exist or has been removed.</p>
                <Link href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                    Back to Home
                </Link>
            </div>
        );
    }

    // ── Derived data ────────────────────────────────────────────────────────
    const avgRating = helper.avgRating > 0 ? helper.avgRating : 0;

    const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: (helper.reviews ?? []).filter((r: Review) => Math.round(r.rating) === star).length,
    }));

    const isOnline = helper.availabilityStatus === 'available';
    const memberSince = new Date(helper.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const bioIsTruncatable = (helper.bio?.length ?? 0) > 220;
    const displayBio = showFullBio || !bioIsTruncatable ? helper.bio : helper.bio?.slice(0, 220) + '…';
    const sortedPortfolio = [...(helper.portfolio ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Back nav ─────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors text-sm">
                    <ArrowLeft size={18} />
                    Back to Search
                </Link>
            </div>

            {/* ── Hero card ─────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                <div className="rounded-3xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)]">

                    {/* Cover banner */}
                    <div className="relative h-44 md:h-56 bg-gradient-to-br from-indigo-800 via-indigo-700 to-violet-700">
                        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-violet-400/20 rounded-full blur-2xl" />

                        {helper.isFeatured && (
                            <div className="absolute top-5 left-5">
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-400/90 text-amber-900 border border-amber-300/50">
                                    <Star size={11} className="fill-amber-900" /> Featured
                                </span>
                            </div>
                        )}

                        {/* Desktop CTA */}
                        <div className="absolute bottom-5 right-6 hidden md:flex flex-col gap-2.5">
                            <button onClick={handleBookNow} className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 text-sm whitespace-nowrap border border-white/20">
                                <CalendarCheck size={16} /> Book Service
                            </button>
                            <button onClick={handleChatNow} className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 text-sm whitespace-nowrap">
                                <MessageCircle size={16} /> Chat Now
                            </button>
                            {helper.phoneNumber && (
                                <a href={`tel:${helper.phoneNumber}`} className="flex items-center justify-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 text-sm whitespace-nowrap">
                                    <Phone size={16} /> Call Now
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Profile row */}
                    <div className="px-6 md:px-10 pb-8">
                        <div className="flex items-end gap-5 -mt-14 md:-mt-16">

                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-indigo-100">
                                    {helper.profileImage ? (
                                        <img src={getMediaUrl(helper.profileImage)} alt={helper.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-indigo-500 font-black text-4xl">
                                            {helper.fullName?.[0]}
                                        </div>
                                    )}
                                </div>
                                {isOnline && <span className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow" />}
                            </div>

                            {/* Name + pills */}
                            <div className="flex-1 min-w-0 pt-14 md:pt-16 pb-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">{helper.fullName}</h1>
                                    {helper.isVerified && <BadgeCheck size={20} className="text-indigo-600 flex-shrink-0" />}
                                    {isOnline ? (
                                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Online
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 border border-gray-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                            {helper.availabilityStatus === 'busy' ? 'Busy' : 'Unavailable'}
                                        </span>
                                    )}
                                </div>
                                <p className="text-indigo-600 font-semibold mb-3 text-sm md:text-base">{helper.headline}</p>
                                <div className="flex flex-wrap gap-2">
                                    {avgRating > 0 && (
                                        <span className="inline-flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
                                            <Star size={11} className="fill-yellow-500 text-yellow-500" />
                                            {avgRating.toFixed(1)} ({helper.totalReviews} reviews)
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                                        <Briefcase size={11} /> {helper.jobsCompleted} Jobs
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                                        <MapPin size={11} /> {helper.city}, {helper.region}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                                        <Clock size={11} /> {helper.experienceYears} Yrs Exp
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Mobile CTA */}
                        <div className="mt-5 flex gap-3 md:hidden">
                            <button onClick={handleBookNow} className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 text-sm active:scale-95 transition-all">
                                <CalendarCheck size={16} /> Book Service
                            </button>
                            <button onClick={handleChatNow} className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-sm active:scale-95 transition-all">
                                <MessageCircle size={16} /> Chat Now
                            </button>
                            {helper.phoneNumber && (
                                <a href={`tel:${helper.phoneNumber}`} className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 hover:border-indigo-300 text-gray-700 font-bold rounded-xl transition-all text-sm">
                                    <Phone size={16} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Trust bar ─────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-6 py-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${helper.isVerified ? 'bg-indigo-50' : 'bg-gray-50'}`}>
                                <BadgeCheck size={16} className={helper.isVerified ? 'text-indigo-600' : 'text-gray-300'} />
                            </div>
                            <span className={`text-sm font-semibold ${helper.isVerified ? 'text-gray-700' : 'text-gray-400'}`}>
                                {helper.isVerified ? 'Verified Professional' : 'Unverified'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-50 p-2 rounded-lg flex-shrink-0">
                                <Shield size={16} className="text-emerald-600" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">Background Checked</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-50 p-2 rounded-lg flex-shrink-0">
                                <Zap size={16} className="text-amber-500" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                                {helper.avgResponseMinutes ? `Responds in ${helper.avgResponseMinutes}m` : 'Fast Response'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-violet-50 p-2 rounded-lg flex-shrink-0">
                                <CreditCard size={16} className="text-violet-600" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">Secure Payments</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main content ──────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-28 lg:pb-12">
                <div className="grid lg:grid-cols-3 gap-6">

                    {/* ── Left column ───────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* About Me */}
                        <ScrollReveal>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 md:p-8">
                                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-5 bg-indigo-600 rounded-full inline-block" />
                                    About Me
                                </h2>
                                <p className="text-gray-600 leading-relaxed text-sm">{displayBio}</p>
                                {bioIsTruncatable && (
                                    <button onClick={() => setShowFullBio(!showFullBio)} className="mt-3 inline-flex items-center gap-1 text-indigo-600 font-bold text-sm hover:text-indigo-700">
                                        {showFullBio ? 'Show Less' : 'Read More'}
                                        {showFullBio ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                    </button>
                                )}
                            </div>
                        </ScrollReveal>

                        {/* Experience & Stats */}
                        <ScrollReveal delay={60}>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 md:p-8">
                                <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <span className="w-1 h-5 bg-indigo-600 rounded-full inline-block" />
                                    Experience &amp; Stats
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="bg-indigo-50 border border-indigo-100/60 rounded-2xl p-5 hover:shadow-md transition-shadow">
                                        <Briefcase size={20} className="text-indigo-500 mb-3" />
                                        <div className="text-2xl font-black text-indigo-700 mb-1">{helper.jobsCompleted}</div>
                                        <div className="text-xs text-gray-500 font-semibold">Jobs Completed</div>
                                    </div>
                                    <div className="bg-yellow-50 border border-yellow-100/60 rounded-2xl p-5 hover:shadow-md transition-shadow">
                                        <Star size={20} className="text-yellow-500 mb-3" />
                                        <div className="text-2xl font-black text-yellow-700 mb-1">
                                            {avgRating > 0 ? avgRating.toFixed(1) : '—'}
                                        </div>
                                        <div className="text-xs text-gray-500 font-semibold">Avg Rating</div>
                                    </div>
                                    <div className="bg-emerald-50 border border-emerald-100/60 rounded-2xl p-5 hover:shadow-md transition-shadow">
                                        <TrendingUp size={20} className="text-emerald-500 mb-3" />
                                        <div className="text-2xl font-black text-emerald-700 mb-1">{helper.completionRate}%</div>
                                        <div className="text-xs text-gray-500 font-semibold">Completion Rate</div>
                                    </div>
                                    <div className="bg-violet-50 border border-violet-100/60 rounded-2xl p-5 hover:shadow-md transition-shadow">
                                        <Award size={20} className="text-violet-500 mb-3" />
                                        <div className="text-2xl font-black text-violet-700 mb-1">{helper.experienceYears}</div>
                                        <div className="text-xs text-gray-500 font-semibold">Years Exp</div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Services */}
                        {(helper.services?.length ?? 0) > 0 && (
                            <ScrollReveal delay={80}>
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 md:p-8">
                                    <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                                        <span className="w-1 h-5 bg-indigo-600 rounded-full inline-block" />
                                        Services Offered
                                    </h2>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {helper.services.map((svc) => (
                                            <div key={svc.id} className="border border-gray-100 rounded-2xl p-5 hover:border-indigo-100 hover:shadow-[0_4px_16px_rgba(99,102,241,0.08)] transition-all group">
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-indigo-50 group-hover:bg-indigo-100 p-3 rounded-xl transition-colors flex-shrink-0">
                                                        <SvcIcon iconKey={svc.iconKey} size={20} className="text-indigo-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-bold text-gray-900 text-sm">{svc.name}</div>
                                                        {svc.description && <p className="text-gray-500 text-xs leading-relaxed mt-1">{svc.description}</p>}
                                                        <div className="flex items-center gap-3 mt-3">
                                                            <span className="text-indigo-600 font-black text-sm">Rs. {svc.price.toLocaleString()}</span>
                                                            {svc.durationHrs && (
                                                                <>
                                                                    <span className="text-gray-300">·</span>
                                                                    <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
                                                                        <Clock size={11} /> {svc.durationHrs} hr{svc.durationHrs !== 1 ? 's' : ''}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>
                        )}

                        {/* Portfolio */}
                        {sortedPortfolio.length > 0 && (
                            <ScrollReveal delay={100}>
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 md:p-8">
                                    <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                                        <span className="w-1 h-5 bg-indigo-600 rounded-full inline-block" />
                                        Portfolio
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {sortedPortfolio.map((item, idx) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setLightboxIndex(idx)}
                                                className="relative group rounded-2xl overflow-hidden aspect-square bg-gray-100 focus:outline-none"
                                            >
                                                <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-3">
                                                    {item.caption && (
                                                        <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity leading-tight line-clamp-2">
                                                            {item.caption}
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>
                        )}

                        {/* Reviews */}
                        <ScrollReveal delay={120}>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 md:p-8">
                                <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <span className="w-1 h-5 bg-indigo-600 rounded-full inline-block" />
                                    Reviews
                                    {helper.totalReviews > 0 && (
                                        <span className="text-gray-400 font-normal text-sm">({helper.totalReviews})</span>
                                    )}
                                </h2>

                                {(helper.reviews?.length ?? 0) > 0 ? (
                                    <>
                                        {/* Rating summary */}
                                        <div className="flex flex-col sm:flex-row gap-6 mb-7 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="flex flex-col items-center justify-center sm:border-r sm:border-gray-200 sm:pr-6 sm:min-w-[110px]">
                                                <div className="text-5xl font-black text-gray-900 leading-none">{avgRating.toFixed(1)}</div>
                                                <StarRow rating={avgRating} size={13} />
                                                <div className="text-xs text-gray-400 font-medium mt-1">{helper.totalReviews} reviews</div>
                                            </div>
                                            <div className="flex-1 space-y-2 justify-center flex flex-col">
                                                {ratingCounts.map(({ star, count }) => (
                                                    <RatingBar key={star} star={star} count={count} total={helper.reviews.length} />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Review cards */}
                                        <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
                                            {helper.reviews.map((review: Review) => (
                                                <div key={review.id} className="border border-gray-100 rounded-2xl p-5 hover:border-indigo-100 hover:shadow-[0_2px_12px_rgba(99,102,241,0.06)] transition-all">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-indigo-100 flex-shrink-0">
                                                            {review.reviewerImage ? (
                                                                <img src={getMediaUrl(review.reviewerImage)} alt={review.reviewerName} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-indigo-500 font-bold text-lg">
                                                                    {review.reviewerName?.[0]}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className="font-bold text-gray-900 text-sm">{review.reviewerName}</span>
                                                                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                                                                        <CheckCircle2 size={9} /> Verified Booking
                                                                    </span>
                                                                </div>
                                                                <span className="text-xs text-gray-400 flex-shrink-0">
                                                                    {new Date(review.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                </span>
                                                            </div>
                                                            <StarRow rating={review.rating} size={13} />
                                                            {review.comment && <p className="mt-2 text-gray-600 text-sm leading-relaxed">{review.comment}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-gray-50 rounded-2xl p-10 text-center">
                                        <Star size={32} className="text-gray-200 mx-auto mb-3" />
                                        <p className="font-semibold text-gray-500">No reviews yet</p>
                                        <p className="text-sm text-gray-400 mt-1">Be the first to hire and leave a review!</p>
                                    </div>
                                )}
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* ── Right sticky sidebar ──────────────────────── */}
                    <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">

                        {/* Booking card */}
                        <ScrollReveal>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.10)] p-6">
                                <div className="mb-5">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Starting From</span>
                                    <div className="flex items-end gap-1 mt-1">
                                        <span className="text-3xl font-black text-indigo-600">Rs. {helper.dailyRate.toLocaleString()}</span>
                                        <span className="text-gray-400 font-medium mb-0.5 text-sm">/day</span>
                                    </div>
                                </div>

                                <ul className="space-y-2.5 mb-6">
                                    <li className="flex items-center gap-2.5 text-sm text-gray-600 font-medium">
                                        <CheckCircle2 size={15} className={isOnline ? 'text-emerald-500' : 'text-gray-400'} />
                                        {isOnline ? 'Available Today' : 'Currently Busy'}
                                    </li>
                                    <li className="flex items-center gap-2.5 text-sm text-gray-600 font-medium">
                                        <Timer size={15} className="text-indigo-500" />
                                        {helper.avgResponseMinutes ? `Avg response ${helper.avgResponseMinutes} min` : 'Fast Response'}
                                    </li>
                                    <li className="flex items-center gap-2.5 text-sm text-gray-600 font-medium">
                                        <Shield size={15} className="text-indigo-500" />
                                        Secure Booking
                                    </li>
                                    <li className="flex items-center gap-2.5 text-sm text-gray-600 font-medium">
                                        <ThumbsUp size={15} className="text-indigo-500" />
                                        {helper.completionRate}% Completion Rate
                                    </li>
                                </ul>

                                <div className="space-y-3">
                                    <button onClick={handleBookNow} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 text-sm">
                                        <CalendarCheck size={17} /> Book Service Now
                                    </button>
                                    <button onClick={handleChatNow} className="w-full py-3 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                                        <MessageCircle size={17} /> Chat with Helper
                                    </button>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Working Hours */}
                        <ScrollReveal delay={80}>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-gray-900 text-sm">Working Hours</h4>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                        {isOnline ? 'Available' : 'Busy'}
                                    </span>
                                </div>
                                {helper.availabilitySchedule && Object.keys(helper.availabilitySchedule).length > 0 ? (
                                    <div className="space-y-2 text-sm">
                                        {DAYS_ORDER.map(day => {
                                            const slot = helper.availabilitySchedule?.[day];
                                            return (
                                                <div key={day} className="flex justify-between items-center">
                                                    <span className="text-gray-500 capitalize w-8">{day}</span>
                                                    {slot ? (
                                                        <span className="font-semibold text-gray-800">{slot.from} – {slot.to}</span>
                                                    ) : (
                                                        <span className="text-gray-300 font-medium">Day off</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">Schedule not set</p>
                                )}
                            </div>
                        </ScrollReveal>

                        {/* Quick Info */}
                        <ScrollReveal delay={100}>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
                                <h4 className="font-bold text-gray-900 text-sm mb-4">Quick Info</h4>
                                <div className="space-y-3 text-sm">
                                    {[
                                        { label: 'Experience', value: `${helper.experienceYears}+ Years` },
                                        { label: 'Jobs Done', value: String(helper.jobsCompleted) },
                                        { label: 'Completion', value: `${helper.completionRate}%` },
                                        { label: 'Member Since', value: memberSince },
                                        { label: 'Service Area', value: `${helper.city}, ${helper.region}` },
                                        { label: 'Daily Rate', value: `Rs. ${helper.dailyRate.toLocaleString()}/day` },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                            <span className="text-gray-400">{label}</span>
                                            <span className="font-semibold text-gray-800 text-right max-w-[55%] leading-snug">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Languages */}
                        {helper.languages && helper.languages.length > 0 && (
                            <ScrollReveal delay={120}>
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
                                    <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                                        <Languages size={15} className="text-indigo-600" /> Languages
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {helper.languages.map(lang => (
                                            <span key={lang} className="inline-flex items-center bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>
                        )}

                        {/* Need Help */}
                        <ScrollReveal delay={160}>
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 shadow-lg shadow-indigo-500/20">
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                                <div className="relative z-10">
                                    <div className="text-2xl mb-2">🎧</div>
                                    <h4 className="font-bold text-white mb-1 text-sm">Need Help?</h4>
                                    <p className="text-indigo-100/80 text-xs font-medium mb-4 leading-relaxed">We are here to help you find the right professional.</p>
                                    <Link href="/contact" className="w-full py-2.5 px-5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors text-sm shadow-lg">
                                        Contact Support
                                    </Link >
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>

            {/* ── Mobile sticky bottom CTA ──────────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden mb-10 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                <div className="flex gap-3">
                    <button onClick={handleChatNow} className="flex-1 py-3 border-2 border-emerald-500 text-emerald-600 font-bold rounded-xl flex items-center justify-center gap-2 text-sm active:scale-95">
                        <MessageCircle size={16} /> Chat Now
                    </button>
                    <button onClick={handleBookNow} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-500/20 active:scale-95">
                        <CalendarCheck size={16} /> Book Service
                    </button>
                </div>
            </div>

            {/* Portfolio lightbox */}
            {lightboxIndex !== null && (
                <Lightbox
                    items={sortedPortfolio}
                    activeIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onPrev={() => setLightboxIndex((lightboxIndex - 1 + sortedPortfolio.length) % sortedPortfolio.length)}
                    onNext={() => setLightboxIndex((lightboxIndex + 1) % sortedPortfolio.length)}
                />
            )}

            {/* Booking modal */}
            <SimpleModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title="Schedule Service">
                <BookingForm
                    helperId={helper.id}
                    helperUserId={helper.userId}
                    helperName={helper.fullName}
                    onSuccess={() => { setIsBookingModalOpen(false); router.push('/bookings'); }}
                    onCancel={() => setIsBookingModalOpen(false)}
                />
            </SimpleModal>
        </div>
    );
}
