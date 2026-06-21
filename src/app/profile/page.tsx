'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    Star, Shield, MapPin, Briefcase, Clock, BadgeCheck,
    Award, CheckCircle2, Zap, Cpu, Search, Sun, Battery,
    Wrench, ChevronDown, ChevronUp, Timer,
    X, Languages, TrendingUp, AlertCircle, Pencil,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ShareButton } from '@/components/ShareButton';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { getMyProfile } from '@/features/helpers/services/helpers.service';
import type { HelperService, PortfolioItem } from '@/features/helpers/types/helpers.types';
import { getMediaUrl } from '@/utils/url';
import ScrollReveal from '@/components/ScrollReveal';

// ─── Icon map for service iconKey ────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    zap: Zap,
    cpu: Cpu,
    search: Search,
    sun: Sun,
    battery: Battery,
    wrench: Wrench,
    timer: Timer,
};

function ServiceIcon({ iconKey, size, className }: { iconKey: string; size?: number; className?: string }) {
    const Icon = ICON_MAP[iconKey] ?? Wrench;
    return <Icon size={size} className={className} />;
}

// ─── Star row ────────────────────────────────────────────────────────────────

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

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({
    items,
    activeIndex,
    onClose,
    onPrev,
    onNext,
}: {
    items: PortfolioItem[];
    activeIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
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
                {item.caption && (
                    <p className="text-center text-white/80 mt-4 font-medium text-sm">{item.caption}</p>
                )}
                <p className="text-center text-white/40 text-xs mt-1">{activeIndex + 1} / {items.length}</p>
            </div>
            <button onClick={onNext} className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                <ChevronDown size={20} className="rotate-90" />
            </button>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyProfilePage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    const [showFullBio, setShowFullBio] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [showAllReviews, setShowAllReviews] = useState(false);

    const { data: profile, isLoading, error } = useQuery({
        queryKey: ['my-profile'],
        queryFn: getMyProfile,
        enabled: isAuthenticated,
    });

    if (!isAuthenticated) {
        router.push('/login');
        return null;
    }

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
                <AlertCircle size={40} className="text-red-400 mb-3" />
                <h2 className="text-xl font-bold text-gray-900 mb-1">Could not load profile</h2>
                <p className="text-gray-500 text-sm">Make sure you are logged in as a helper.</p>
            </div>
        );
    }

    // ── Derived ─────────────────────────────────────────────────────────────
    const isOnline = profile.availabilityStatus === 'available';
    const memberSince = format(new Date(profile.createdAt), 'MMM yyyy');
    const bioIsTruncatable = (profile.bio?.length ?? 0) > 220;
    const displayBio = showFullBio || !bioIsTruncatable
        ? profile.bio
        : profile.bio?.slice(0, 220) + '…';

    const sortedPortfolio = [...profile.portfolio].sort((a, b) => a.sortOrder - b.sortOrder);


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* ── Hero card ─────────────────────────────────────── */}
                <div className="rounded-3xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] mb-5">

                    {/* Cover */}
                    <div className="relative h-40 md:h-52 bg-gradient-to-br from-indigo-800 via-indigo-700 to-violet-700">
                        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-violet-400/20 rounded-full blur-2xl" />

                        {/* Approval badge in cover */}
                        <div className="absolute top-5 right-5">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border bg-white/10 backdrop-blur-sm text-white border-white/20`}>
                                <CheckCircle2 size={12} />
                                {profile.approvalStatus.charAt(0).toUpperCase() + profile.approvalStatus.slice(1)}
                            </span>
                        </div>

                        {profile.isFeatured && (
                            <div className="absolute top-5 left-5">
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-400/90 text-amber-900 border border-amber-300/50 backdrop-blur-sm">
                                    <Star size={11} className="fill-amber-900" />
                                    Featured
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Profile row */}
                    <div className="px-6 md:px-10 pb-8">
                        <div className="flex items-end gap-5 -mt-14 md:-mt-16">

                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-indigo-100">
                                    {profile.profileImage ? (
                                        <img src={getMediaUrl(profile.profileImage)} alt={profile.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-indigo-500 font-black text-4xl">
                                            {profile.fullName?.[0]}
                                        </div>
                                    )}
                                </div>
                                {isOnline && (
                                    <span className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow" />
                                )}
                            </div>

                            {/* Name + pills */}
                            <div className="flex-1 min-w-0 pt-14 md:pt-16 pb-1 relative">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">{profile.fullName}</h1>
                                    {profile.isVerified && <BadgeCheck size={20} className="text-indigo-600 flex-shrink-0" />}
                                    {isOnline ? (
                                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            Available
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 border border-gray-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                            {profile.availabilityStatus === 'busy' ? 'Busy' : 'Unavailable'}
                                        </span>
                                    )}
                                </div>
                                <p className="text-indigo-600 font-semibold mb-3 text-sm md:text-base">{profile.headline}</p>
                                <div className="flex flex-wrap gap-2">
                                    {profile.avgRating > 0 && (
                                        <span className="inline-flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
                                            <Star size={11} className="fill-yellow-500 text-yellow-500" />
                                            {profile.avgRating.toFixed(1)} ({profile.totalReviews} reviews)
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                                        <Briefcase size={11} />
                                        {profile.jobsCompleted} Jobs
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                                        <MapPin size={11} />
                                        {profile.city}, {profile.region}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                                        <Clock size={11} />
                                        {profile.experienceYears} Yrs Exp
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Profile actions */}
                        <div className="flex-shrink-0 self-end pb-1 flex items-center gap-2 mt-4">
                            <ShareButton
                                url={`${typeof window !== 'undefined' ? window.location.origin : 'https://hunarwalaa.com'}/helper/${profile.userId}`}
                                title={`${profile.fullName} — ${profile.headline ?? 'Professional'} on HunarWalaa`}
                                text={`Check out ${profile.fullName}'s profile on HunarWalaa — ${profile.city} professional.`}
                            />
                            <Link
                                href="/profile/edit"
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                            >
                                <Pencil size={14} />
                                <span className="hidden sm:inline">Edit Profile</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Stats bar ─────────────────────────────────────── */}
                <ScrollReveal>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 flex items-center gap-4">
                            <div className="bg-indigo-50 p-3 rounded-xl flex-shrink-0">
                                <Briefcase size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-black text-gray-900">{profile.jobsCompleted}</div>
                                <div className="text-xs text-gray-400 font-semibold">Jobs Done</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 flex items-center gap-4">
                            <div className="bg-yellow-50 p-3 rounded-xl flex-shrink-0">
                                <Star size={20} className="text-yellow-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-black text-gray-900">
                                    {profile.avgRating > 0 ? profile.avgRating.toFixed(1) : '—'}
                                </div>
                                <div className="text-xs text-gray-400 font-semibold">Avg Rating</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 flex items-center gap-4">
                            <div className="bg-emerald-50 p-3 rounded-xl flex-shrink-0">
                                <TrendingUp size={20} className="text-emerald-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-black text-gray-900">{profile.completionRate}%</div>
                                <div className="text-xs text-gray-400 font-semibold">Completion</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 flex items-center gap-4">
                            <div className="bg-violet-50 p-3 rounded-xl flex-shrink-0">
                                <Timer size={20} className="text-violet-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-black text-gray-900">
                                    {profile.avgResponseMinutes != null ? `${profile.avgResponseMinutes}m` : '—'}
                                </div>
                                <div className="text-xs text-gray-400 font-semibold">Avg Response</div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* ── Main grid ─────────────────────────────────────── */}
                <div className="grid lg:grid-cols-3 gap-5">

                    {/* ── Left column ───────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* About Me */}
                        <ScrollReveal>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 md:p-8">
                                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-5 bg-indigo-600 rounded-full inline-block" />
                                    About Me
                                </h2>
                                <p className="text-gray-600 leading-relaxed text-sm">{displayBio}</p>
                                {bioIsTruncatable && (
                                    <button
                                        onClick={() => setShowFullBio(!showFullBio)}
                                        className="mt-3 inline-flex items-center gap-1 text-indigo-600 font-bold text-sm hover:text-indigo-700"
                                    >
                                        {showFullBio ? 'Show Less' : 'Read More'}
                                        {showFullBio ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                    </button>
                                )}
                            </div>
                        </ScrollReveal>

                        {/* Services */}
                        {profile.services.length > 0 && (
                            <ScrollReveal delay={60}>
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 md:p-8">
                                    <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                                        <span className="w-1 h-5 bg-indigo-600 rounded-full inline-block" />
                                        My Services
                                    </h2>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {profile.services.map((svc: HelperService) => (
                                            <div
                                                key={svc.id}
                                                className="border border-gray-100 rounded-2xl p-5 hover:border-indigo-100 hover:shadow-[0_4px_16px_rgba(99,102,241,0.08)] transition-all group"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-indigo-50 group-hover:bg-indigo-100 p-3 rounded-xl transition-colors flex-shrink-0">
                                                        <ServiceIcon iconKey={svc.iconKey} size={20} className="text-indigo-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-bold text-gray-900 text-sm">{svc.name}</div>
                                                        <p className="text-gray-500 text-xs leading-relaxed mt-1">{svc.description}</p>
                                                        <div className="flex items-center gap-3 mt-3">
                                                            <span className="text-indigo-600 font-black text-sm">Rs. {svc.price.toLocaleString()}</span>
                                                            <span className="text-gray-300">·</span>
                                                            <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
                                                                <Clock size={11} />
                                                                {svc.durationHrs} hr{svc.durationHrs !== 1 ? 's' : ''}
                                                            </span>
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
                                        My Work
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {sortedPortfolio.map((item, idx) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setLightboxIndex(idx)}
                                                className="relative group rounded-2xl overflow-hidden aspect-square bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.caption}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-2xl flex items-end p-3">
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
                        {/* Availability Schedule */}
                        {profile.availabilitySchedule && Object.keys(profile.availabilitySchedule).length > 0 && (
                            <ScrollReveal delay={120}>
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 md:p-8">
                                    <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                                        <span className="w-1 h-5 bg-indigo-600 rounded-full inline-block" />
                                        Working Hours
                                    </h2>
                                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                        {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => {
                                            const slot = profile.availabilitySchedule?.[day];
                                            return (
                                                <div
                                                    key={day}
                                                    className={`rounded-xl p-3 text-center ${slot ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-50 border border-gray-100'}`}
                                                >
                                                    <div className={`text-xs font-bold uppercase tracking-wide mb-1.5 ${slot ? 'text-indigo-700' : 'text-gray-300'}`}>
                                                        {day}
                                                    </div>
                                                    {slot ? (
                                                        <div className="text-[10px] text-indigo-600 font-semibold leading-tight">
                                                            {slot.from}<br />{slot.to}
                                                        </div>
                                                    ) : (
                                                        <div className="text-[10px] text-gray-300 font-medium">Off</div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </ScrollReveal>
                        )}

                        {/* Reviews */}
                        {profile.reviews && profile.reviews.length > 0 && (
                            <ScrollReveal delay={140}>
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 md:p-8">
                                    <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                                        <span className="w-1 h-5 bg-indigo-600 rounded-full inline-block" />
                                        Reviews
                                        <span className="ml-auto text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                                            {profile.totalReviews}
                                        </span>
                                    </h2>
                                    <div className="space-y-4">
                                        {(showAllReviews ? profile.reviews : profile.reviews.slice(0, 4)).map(review => (
                                            <div key={review.id} className="flex gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                                {/* Avatar */}
                                                <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden bg-indigo-100">
                                                    {review.reviewerImage ? (
                                                        <img src={review.reviewerImage} alt={review.reviewerName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-indigo-500 font-black text-sm">
                                                            {review.reviewerName?.[0] ?? '?'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                        <span className="text-sm font-bold text-gray-900 truncate">{review.reviewerName}</span>
                                                        <span className="text-xs text-gray-400 flex-shrink-0">
                                                            {format(new Date(review.createdAt), 'MMM d, yyyy')}
                                                        </span>
                                                    </div>
                                                    <StarRow rating={review.rating} size={12} />
                                                    {review.comment && (
                                                        <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{review.comment}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {profile.reviews.length > 4 && (
                                        <button
                                            onClick={() => setShowAllReviews(!showAllReviews)}
                                            className="mt-4 w-full py-2.5 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 text-gray-500 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            {showAllReviews ? 'Show Less' : `Show All ${profile.reviews.length} Reviews`}
                                            {showAllReviews ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </button>
                                    )}
                                </div>
                            </ScrollReveal>
                        )}

                    </div>

                    {/* ── Right sidebar ─────────────────────────────── */}
                    <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">

                        {/* Quick Info */}
                        <ScrollReveal>
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
                                <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-indigo-600 rounded-full inline-block" />
                                    Quick Info
                                </h4>
                                <div className="space-y-3 text-sm">
                                    {[
                                        { label: 'Daily Rate', value: `Rs. ${profile.dailyRate.toLocaleString()}/day` },
                                        { label: 'Experience', value: `${profile.experienceYears}+ Years` },
                                        { label: 'Member Since', value: memberSince },
                                        { label: 'Service Area', value: `${profile.city}, ${profile.region}` },
                                        { label: 'Country', value: profile.country },
                                        { label: 'Phone', value: profile.phoneNumber },
                                        { label: 'Approval', value: profile.approvalStatus.charAt(0).toUpperCase() + profile.approvalStatus.slice(1) },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                            <span className="text-gray-400">{label}</span>
                                            <span className={`font-semibold text-right max-w-[55%] leading-snug ${label === 'Approval' ? (profile.approvalStatus === 'approved' ? 'text-emerald-600' : profile.approvalStatus === 'pending' ? 'text-amber-600' : 'text-red-600') : 'text-gray-800'}`}>
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Languages */}
                        {profile.languages.length > 0 && (
                            <ScrollReveal delay={60}>
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
                                    <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                                        <Languages size={15} className="text-indigo-600" />
                                        Languages
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.languages.map((lang) => (
                                            <span
                                                key={lang}
                                                className="inline-flex items-center bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full"
                                            >
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>
                        )}

                        {/* Rating summary */}
                        {profile.avgRating > 0 && (
                            <ScrollReveal delay={80}>
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
                                    <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                                        <Star size={15} className="text-yellow-500" />
                                        Rating
                                    </h4>
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl font-black text-gray-900">{profile.avgRating.toFixed(1)}</div>
                                        <div>
                                            <StarRow rating={profile.avgRating} size={14} />
                                            <p className="text-xs text-gray-400 font-medium mt-1">{profile.totalReviews} reviews</p>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        )}

                        {/* Trust card */}
                        <ScrollReveal delay={120}>
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 shadow-lg shadow-indigo-500/20">
                                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                <div className="relative z-10 space-y-3">
                                    <h4 className="font-bold text-white text-sm">Profile Status</h4>
                                    {[
                                        { icon: BadgeCheck, text: profile.isVerified ? 'Identity Verified' : 'Not Verified', ok: profile.isVerified },
                                        { icon: Shield, text: profile.approvalStatus === 'approved' ? 'Account Approved' : 'Pending Approval', ok: profile.approvalStatus === 'approved' },
                                        { icon: Award, text: profile.isFeatured ? 'Featured Professional' : 'Standard Listing', ok: profile.isFeatured },
                                    ].map(({ icon: Icon, text, ok }) => (
                                        <div key={text} className="flex items-center gap-2.5">
                                            <Icon size={14} className={ok ? 'text-emerald-300' : 'text-white/40'} />
                                            <span className={`text-xs font-semibold ${ok ? 'text-white' : 'text-white/50'}`}>{text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <Lightbox
                    items={sortedPortfolio}
                    activeIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onPrev={() => setLightboxIndex((lightboxIndex - 1 + sortedPortfolio.length) % sortedPortfolio.length)}
                    onNext={() => setLightboxIndex((lightboxIndex + 1) % sortedPortfolio.length)}
                />
            )}
        </div>
    );
}
