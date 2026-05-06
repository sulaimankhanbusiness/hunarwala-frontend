'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Star, Shield, Award, Search, MapPin, Target, Loader2, CheckCircle2, Briefcase, ChevronDown, CalendarCheck } from 'lucide-react';

import { getHelpers, getTopRatedProfessionals } from '../services/helpers.service';
import { reverseGeocode } from '@/features/location/services/location.service';
import { getCachedLocation, setCachedLocation } from '@/features/location/utils/locationCache';
import type { SortBy } from '../types/helpers.types';
import CitySelect from '@/features/location/components/CitySelect';
import SkillSelect from '@/features/skills/components/SkillSelect';
import LocationPermissionsModal from '@/features/location/components/LocationPermissionsModal';
import { getMediaUrl } from '@/utils/url';
import { BookingForm } from '@/features/bookings/components/BookingForm';
import { SimpleModal } from '@/components/SimpleModal';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { useSkillStore } from '@/stores/useSkillStore';
const HelperMap = dynamic(() => import('./HelperMap'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-2xl" />,
});

export default function HelperSearch() {
  const [skill, setSkill] = useState('');
  const [location, setLocation] = useState({ country: '', region: '', city: '' });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isNearByActive, setIsNearByActive] = useState(false);
  const [radius, setRadius] = useState(10);
  const [showMap, setShowMap] = useState(false);

  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [isCityDetecting, setIsCityDetecting] = useState(false);
  const [selectedHelperIds, setSelectedHelperIds] = useState<string[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [singleBookingHelper, setSingleBookingHelper] = useState<{ id: string; name: string } | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('rating');
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<{
    skill?: string;
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
  }>({});

  // On mount: read ?skill= from the URL (e.g. navigating from the Services page)
  // and pre-select + auto-search for that skill.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const skillParam = params.get('skill');
    if (skillParam) {
      setSkill(skillParam);
      setSearchParams({ skill: skillParam });
    }
  }, []);

  // On mount: resolve the city for the "Top Rated in <city>" header.
  // Uses a 1-hour localStorage cache to avoid hitting the reverse-geocode API
  // on every page load.
  useEffect(() => {
    const detectInitialCity = async () => {
      // 1. Serve from cache if still fresh
      const cached = getCachedLocation();
      if (cached) {
        setDetectedCity(cached.city);
        return;
      }

      // 2. Dynamically import to keep location logic server-safe
      const { queryGeolocationPermission, getCurrentCoordinates } = await import(
        '@/features/location/services/location.service'
      );

      const { state } = await queryGeolocationPermission();

      if (state === 'denied' || state === 'unsupported') {
        setIsModalOpen(true);
        return;
      }

      setIsCityDetecting(true);
      try {
        const position = await getCurrentCoordinates();
        const { latitude, longitude } = position.coords;
        const data = await reverseGeocode(latitude, longitude);
        if (data?.city) {
          setDetectedCity(data.city);
          setCachedLocation(data.city, latitude, longitude);
        }
      } catch (err) {
        console.error('Initial city detection failed:', err);
        setIsModalOpen(true);
      } finally {
        setIsCityDetecting(false);
      }
    };

    detectInitialCity();
  }, []);

  const { pendingSkill, setPendingSkill } = useSkillStore();
  useEffect(() => {
    if (!pendingSkill) return;
    setSkill(pendingSkill);
    setSearchParams({ skill: pendingSkill });
    setPendingSkill(null);
  }, [pendingSkill, setPendingSkill]);

  const { isAuthenticated } = useAuthStore();
  const handleBookNow = ({ id, name }: { id: string; name: string }) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setSingleBookingHelper({ id, name });
  };

  const handleSearch = (manualLoc?: typeof location) => {
    const params: Record<string, any> = {};
    if (skill) params.skill = skill;

    const currentLoc = manualLoc || location;

    if (userLocation && !manualLoc) {
      params.latitude = userLocation.lat;
      params.longitude = userLocation.lng;
      params.radiusKm = radius;
    } else {
      if (currentLoc.country) params.country = currentLoc.country;
      if (currentLoc.region) params.region = currentLoc.region;
      if (currentLoc.city) params.city = currentLoc.city;
      setDetectedCity(currentLoc.city || null);
    }

    setSearchParams(params);
  };

  const clearNearBy = () => {
    setIsNearByActive(false);
    setUserLocation(null);
    setSearchParams({});
    setSelectedHelperIds([]);
  };

  const toggleHelperSelection = (helperId: string) => {
    setSelectedHelperIds(prev =>
      prev.includes(helperId)
        ? prev.filter(id => id !== helperId)
        : [...prev, helperId]
    );
  };

  const handleNearMeClick = () => {
    setIsModalOpen(true);
  };

  const handleLocationSuccess = async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;

    setUserLocation({ lat: latitude, lng: longitude });
    setIsNearByActive(true);
    setLocation({ country: '', region: '', city: '' });
    setShowMap(true);

    const params: Record<string, any> = { latitude, longitude, radiusKm: radius };
    if (skill) params.skill = skill;
    setSearchParams(params);

    try {
      const data = await reverseGeocode(latitude, longitude);
      if (data?.city) {
        setDetectedCity(data.city);
        setCachedLocation(data.city, latitude, longitude);
      }
    } catch {
      // Non-critical — heading just won't show city name
    }
  };

  const { data: responseData, isLoading, error } = useQuery({
    queryKey: ['helpers', searchParams],
    queryFn: () => getHelpers({ ...searchParams, limit: 10 }),
    enabled: Object.keys(searchParams).length > 0,
  });

  const { data: topRatedData, isLoading: isTopRatedLoading } = useQuery({
    queryKey: ['top-rated-helpers', detectedCity],
    queryFn: () => getTopRatedProfessionals(detectedCity!),
    enabled: !!detectedCity && Object.keys(searchParams).length === 0,
  });

  const isManualSearch = Object.keys(searchParams).length > 0;
  const rawHelpers = isManualSearch ? (responseData?.items ?? []) : (topRatedData?.items ?? []);
  const isAnyLoading = isLoading || isTopRatedLoading || isCityDetecting;

  const helpers = [...rawHelpers].sort((a: any, b: any) => {
    switch (sortBy) {
      case 'rating':      return (b.averageRating || 0) - (a.averageRating || 0);
      case 'price_asc':   return (a.ratePerHour || 0) - (b.ratePerHour || 0);
      case 'price_desc':  return (b.ratePerHour || 0) - (a.ratePerHour || 0);
      case 'experience':  return (b.experienceYears || 0) - (a.experienceYears || 0);
      default:            return 0;
    }
  });

  /* Card banner gradient per-index for visual variety */
  const CARD_BANNERS = [
    'from-blue-600 to-indigo-700',
    'from-violet-600 to-purple-700',
    'from-emerald-600 to-teal-700',
    'from-rose-500 to-pink-700',
    'from-amber-500 to-orange-600',
    'from-cyan-600 to-sky-700',
  ];

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-700">

      {/* ── Search band ─────────────────────────────────────────────────── */}
      <div className="relative bg-white pt-12 pb-10 px-4 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.06)_0%,_transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        {/* Title area */}
        <div className="max-w-5xl mx-auto text-center mb-10 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold mb-5 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            1,200+ Verified Experts Across Pakistan
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Find Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Professional
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
            Search skilled tradespeople near you — plumbers, electricians, cleaners & more
          </p>

          {/* Mini stats */}
          <div className="flex items-center justify-center gap-6 mt-5">
            {[['50+', 'Services'], ['10K+', 'Bookings'], ['4.8★', 'Avg Rating']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-sm font-extrabold text-gray-800">{val}</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search card */}
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="bg-white rounded-2xl shadow-[0_2px_0_rgba(99,102,241,0.15),0_16px_50px_rgba(0,0,0,0.09)] border border-gray-100 p-1.5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch">

              {/* Service */}
              <div className="md:col-span-4 px-5 py-4 md:border-r border-gray-100 hover:bg-gray-50/60 transition-colors rounded-xl group">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Search size={11} className="text-indigo-500" strokeWidth={2.5} />
                  <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-[0.12em]">What service?</label>
                </div>
                <SkillSelect value={skill} onChange={setSkill} />
              </div>

              {/* Location / Radius */}
              <div className="md:col-span-12 lg:col-span-5 px-5 py-4 md:border-r border-gray-100 hover:bg-gray-50/60 transition-colors group">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-indigo-500" strokeWidth={2.5} />
                    <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-[0.12em]">
                      {isNearByActive ? 'Search radius' : 'Where?'}
                    </label>
                  </div>
                  <div className="flex gap-2">
                    {isNearByActive && (
                      <button onClick={clearNearBy} className="text-[10px] font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors px-1">
                        Reset
                      </button>
                    )}
                    <button
                      onClick={handleNearMeClick}
                      className={`text-[10px] font-bold flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-300 ${isNearByActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                    >
                      <Target size={10} />
                      {isNearByActive ? 'Detected' : 'Near Me'}
                    </button>
                  </div>
                </div>
                <div className="relative">
                  {isNearByActive ? (
                    <div className="flex items-center gap-4 h-[44px] animate-in fade-in zoom-in duration-300">
                      <input type="range" min="1" max="100" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} className="flex-1 h-1.5 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                      <span className="text-sm font-black text-indigo-600 whitespace-nowrap bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">{radius} km</span>
                    </div>
                  ) : (
                    <CitySelect {...location} onLocationChange={(loc) => { setLocation(loc); setUserLocation(null); setIsNearByActive(false); }} />
                  )}
                </div>
              </div>

              {/* Search Button */}
              <div className="md:col-span-12 lg:col-span-3 p-2 flex items-center">
                <button
                  onClick={() => handleSearch()}
                  className="w-full h-[54px] bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black rounded-xl transition-all shadow-[0_6px_20px_rgba(99,102,241,0.45)] hover:shadow-[0_10px_28px_rgba(99,102,241,0.55)] hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2.5"
                >
                  <Search size={17} strokeWidth={2.5} />
                  <span className="text-[15px] font-extrabold">Search Pros</span>
                </button>
              </div>
            </div>
          </div>

          {/* Popular tags */}
          <div className="flex flex-wrap items-center gap-2 mt-4 justify-center">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Trending:</span>
            {[
              { label: 'Plumbing', emoji: '🔧' },
              { label: 'Electrical', emoji: '⚡' },
              { label: 'Cleaning', emoji: '🧹' },
              { label: 'Carpentry', emoji: '🪚' },
              { label: 'Painting', emoji: '🎨' },
              { label: 'AC Repair & Servicing', emoji: '❄️' },
            ].map(({ label, emoji }) => (
              <button
                key={label}
                onClick={() => { setSkill(label); setSearchParams({ skill: label }); }}
                className="inline-flex items-center gap-1.5 text-xs bg-white hover:bg-indigo-600 text-gray-600 hover:text-white px-3.5 py-1.5 rounded-full border border-gray-200 hover:border-indigo-600 transition-all duration-200 font-semibold shadow-sm hover:shadow-indigo-200"
              >
                <span>{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results section ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 mt-8">

        {/* Results header card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] border border-gray-100 px-6 py-4 mb-8 flex flex-wrap gap-3 justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {isManualSearch
                ? rawHelpers.length > 0 ? `${rawHelpers.length} Professionals Found` : 'No Professionals Found'
                : detectedCity ? `Top Pros in ${detectedCity}` : 'Top Rated Professionals'}
            </h3>
            {!isManualSearch && <p className="text-xs text-gray-400 mt-0.5">Based on your location • Sorted by rating</p>}
          </div>

          <div className="flex items-center gap-3">
            {!showMap && (
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="appearance-none pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="experience">Most Experienced</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            )}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button onClick={() => setShowMap(false)} className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${!showMap ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>List</button>
              <button onClick={() => setShowMap(true)}  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${showMap  ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>Map</button>
            </div>
          </div>
        </div>

        {showMap ? (
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <HelperMap helpers={helpers} userLocation={userLocation} />
          </div>
        ) : (
          <>
            {isAnyLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                <p className="text-gray-500 font-medium">{isCityDetecting ? 'Detecting your location...' : 'Finding best professionals...'}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-600">
                <p className="font-medium">Unable to load professionals.</p>
                <p className="text-sm mt-1">Please ensure the backend server is running.</p>
              </div>
            )}

            {helpers.length === 0 && !isAnyLoading && !error && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No professionals found</h3>
                <p className="text-gray-500 text-sm">{isManualSearch ? 'Try adjusting your search or location.' : `No pros found in ${detectedCity || 'your area'} yet.`}</p>
              </div>
            )}

            {/* ── Pro Cards (Fiverr-style) ─────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
              {helpers.map((helper: any, idx: number) => {
                const rating    = Number(helper.averageRating) || 0;
                const fullStars = Math.floor(rating);
                const banner    = CARD_BANNERS[idx % CARD_BANNERS.length];

                return (
                  <div
                    key={helper.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.14)] hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col"
                  >
                    {/* Colored top banner */}
                    <div className={`relative h-24 bg-gradient-to-br ${banner} flex-shrink-0`}>
                      {/* Select checkbox */}
                      <button
                        onClick={() => toggleHelperSelection(helper.id)}
                        className={`absolute top-3 left-3 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 ${selectedHelperIds.includes(helper.id) ? 'bg-white text-indigo-600 shadow-md scale-110' : 'bg-white/20 text-white/70 hover:bg-white/40 hover:text-white border border-white/30'}`}
                      >
                        <CheckCircle2 size={14} strokeWidth={2.5} />
                      </button>

                      {/* Available badge */}
                      <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/30">
                        ✓ Verified
                      </div>

                      {/* Avatar — overlaps the banner */}
                      <div className="absolute -bottom-8 left-5">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-3 border-white shadow-xl ring-2 ring-white" style={{ border: '3px solid white' }}>
                          {helper.profileImage ? (
                            <img src={getMediaUrl(helper.profileImage)} alt={helper.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${banner} flex items-center justify-center text-white font-extrabold text-xl`}>
                              {helper.fullName?.[0]}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="pt-10 px-5 pb-5 flex flex-col flex-1">

                      {/* Name + rating row */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-base font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-1 flex items-center gap-1.5">
                          {helper.fullName}
                          <span className="inline-flex items-center justify-center w-4 h-4 bg-indigo-600 rounded-full flex-shrink-0">
                            <Shield size={9} className="text-white" fill="white" />
                          </span>
                        </h3>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {rating > 0 ? (
                            <>
                              {[1,2,3,4,5].map(s => (
                                <Star key={s} size={12} className={s <= fullStars ? 'text-amber-400' : 'text-gray-200'} fill="currentColor" />
                              ))}
                              <span className="text-[11px] font-bold text-gray-500 ml-0.5">{rating.toFixed(1)}</span>
                            </>
                          ) : (
                            <span className="text-[10px] text-gray-300 font-medium italic">No reviews</span>
                          )}
                        </div>
                      </div>

                      {/* Headline */}
                      <p className="text-indigo-600 font-semibold text-sm mb-1.5">{helper.headline || '—'}</p>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                        <MapPin size={11} />
                        {helper.city}, {helper.region}
                      </div>

                      {/* Bio */}
                      <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-4">{helper.bio}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-auto mb-4">
                        <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-lg">
                          <Award size={12} className="text-gray-400" />
                          {helper.experienceYears} Yrs Exp
                        </span>
                        {(helper.jobsCompleted || 0) > 0 && (
                          <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                            {helper.jobsCompleted} Jobs Done
                          </span>
                        )}
                      </div>

                      {/* Price + actions */}
                      <div className="border-t border-gray-100 pt-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none mb-0.5">Starting from</p>
                          <p className="text-xl font-extrabold text-gray-900 leading-none">
                            Rs.{helper.ratePerHour}
                            <span className="text-xs font-medium text-gray-400">/hr</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/helper/${helper.id}`}
                            className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all text-xs"
                          >
                            Profile
                          </Link>
                          <button
                            onClick={() => handleBookNow({ id: helper.id, name: helper.fullName })}
                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all text-xs flex items-center gap-1.5 shadow-md shadow-indigo-200/60"
                          >
                            <CalendarCheck size={13} />
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedHelperIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="bg-white/90 backdrop-blur-xl border border-indigo-100 px-6 py-4 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-indigo-200">
                {selectedHelperIds.length}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-none">Selected</p>
                <p className="text-[10px] text-gray-500 font-medium">Pros chosen for booking</p>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-100" />

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedHelperIds([])}
                className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center gap-2"
              >
                <Briefcase size={16} />
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Booking Modal */}
      <SimpleModal
        isOpen={!!singleBookingHelper}
        onClose={() => setSingleBookingHelper(null)}
        title={`Book ${singleBookingHelper?.name || ''}`}
      >
        <BookingForm
          helperIds={singleBookingHelper ? [singleBookingHelper.id] : []}
          helperName={singleBookingHelper?.name || ''}
          onSuccess={() => setSingleBookingHelper(null)}
          onCancel={() => setSingleBookingHelper(null)}
        />
      </SimpleModal>

      {/* Bulk Booking Modal */}
      <SimpleModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Broadcast Booking Request"
      >
        <BookingForm
          helperIds={selectedHelperIds}
          helperName={`${selectedHelperIds.length} Selected Professionals`}
          onSuccess={() => {
            setIsBookingModalOpen(false);
            setSelectedHelperIds([]);
          }}
          onCancel={() => setIsBookingModalOpen(false)}
        />
      </SimpleModal>

      {/* Location Modal */}
      <LocationPermissionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleLocationSuccess}
        onManualSelect={(loc) => {
          setLocation(loc);
          setUserLocation(null);
          setIsNearByActive(false);
          handleSearch(loc);
        }}
      />
    </div>
  );
}
