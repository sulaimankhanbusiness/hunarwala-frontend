'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getHelpers, getTopRatedProfessionals } from '../services/helpers.service';
import { getCurrentCoordinates, reverseGeocode } from '@/features/location/services/location.service';
import { Star, Shield, Award, Search, MapPin, Target, Loader2 } from 'lucide-react';

import Link from 'next/link';
import CitySelect from '@/features/location/components/CitySelect';
import SkillSelect from '@/features/skills/components/SkillSelect';
import dynamic from 'next/dynamic';
import LocationPermissionsModal from '@/features/location/components/LocationPermissionsModal';

const HelperMap = dynamic(() => import('./HelperMap'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-2xl" />
});

export default function HelperSearch() {
  const [skill, setSkill] = useState('');
  const [location, setLocation] = useState({ country: '', region: '', city: '' });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isNearByActive, setIsNearByActive] = useState(false);
  const [radius, setRadius] = useState(10); // default 10km
  const [showMap, setShowMap] = useState(false);

  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [isCityDetecting, setIsCityDetecting] = useState(false);
  const [locationError, setLocationError] = useState<{ code: number; message: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Search parameters state
  const [searchParams, setSearchParams] = useState<{
    skill?: string;
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
  }>({});

  useEffect(() => {
    const findCity = async () => {
      setIsCityDetecting(true);
      try {
        const position = await getCurrentCoordinates();
        const { latitude, longitude } = position.coords;
        console.log({ latitude, longitude });
        console.log(latitude, longitude);
        const data = await reverseGeocode(latitude, longitude);
        console.log(data);
        if (data && data.city) {
          setDetectedCity(data.city);
        }
      } catch (err: any) {
        console.error('Initial city detection failed:', err);
        setLocationError({ code: err.code || 0, message: err.message });

        // Show modal on first load if permission is denied or position unavailable
        // This ensures the user is prompted to fix it immediately
        setIsModalOpen(true);
      } finally {
        setIsCityDetecting(false);
      }
    };
    findCity();
  }, []);



  // Trigger search when updated
  const handleSearch = (manualLoc?: typeof location) => {
    const params: any = {};
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
    setSearchParams({}); // Reset search when switching back
  };

  const detectLocation = async () => {
    setIsDetecting(true);
    setLocationError(null);
    try {
      const position = await getCurrentCoordinates();
      const { latitude, longitude } = position.coords;

      setUserLocation({ lat: latitude, lng: longitude });
      setIsNearByActive(true);

      const params: any = { latitude, longitude, radius };
      if (skill) params.skill = skill;
      setSearchParams(params);

      setLocation({ country: '', region: '', city: '' });
      setShowMap(true);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error detecting location:', error);
      setLocationError({ code: error.code || 0, message: error.message });
      setIsModalOpen(true);
    } finally {
      setIsDetecting(false);
    }
  };

  const { data: responseData, isLoading, error } = useQuery({
    queryKey: ['helpers', searchParams],
    queryFn: () => getHelpers({
      ...searchParams,
      limit: 10
    }),
    enabled: Object.keys(searchParams).length > 0,
  });

  // Top Rated Professionals Query
  const { data: topRatedData, isLoading: isTopRatedLoading } = useQuery({
    queryKey: ['top-rated-helpers', detectedCity],
    queryFn: () => getTopRatedProfessionals(detectedCity!),
    enabled: !!detectedCity && Object.keys(searchParams).length === 0,
  });

  const isManualSearch = Object.keys(searchParams).length > 0;
  const helpers = isManualSearch ? (responseData?.items || []) : (topRatedData?.items || []);
  const isAnyLoading = isLoading || isTopRatedLoading || isCityDetecting;



  return (
    <div className="w-full max-w-6xl mx-auto px-4 -mt-10 relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Search Bar Container */}
      <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-2 md:p-3 mb-12 border border-gray-100 backdrop-blur-sm bg-white/95">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-center">
          {/* Service Column */}
          <div className="md:col-span-4 p-4 md:border-r border-gray-100 hover:bg-gray-50/50 transition-colors rounded-l-2xl group">
            <label className="block text-[10px] font-bold text-blue-600 uppercase tracking-[0.1em] mb-1 group-hover:translate-x-1 transition-transform">What service?</label>
            <SkillSelect value={skill} onChange={setSkill} />
          </div>

          {/* Location/Distance Column */}
          <div className="md:col-span-12 lg:col-span-5 p-4 md:border-r border-gray-100 hover:bg-gray-50/50 transition-colors group">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-bold text-blue-600 uppercase tracking-[0.1em] group-hover:translate-x-1 transition-transform">
                {isNearByActive ? 'Search radius' : 'Where?'}
              </label>

              <div className="flex gap-2">
                {isNearByActive && (
                  <button
                    onClick={clearNearBy}
                    className="text-[10px] font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors px-1"
                  >
                    Reset
                  </button>
                )}
                <button
                  onClick={detectLocation}
                  disabled={isDetecting}
                  className={`text-[10px] font-bold flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-300 ${isNearByActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                >
                  {isDetecting ? (
                    <span className="flex items-center gap-1">
                      <Loader2 size={10} className="animate-spin" />
                      Locating...
                    </span>
                  ) : (
                    <>
                      <Target size={10} />
                      {isNearByActive ? 'Detected' : 'Near Me'}
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              {isNearByActive ? (
                <div className="flex items-center gap-4 h-[44px] animate-in fade-in zoom-in duration-300">
                  <div className="flex-1 relative flex items-center group/slider">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={radius}
                      onChange={(e) => setRadius(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                  <span className="text-sm font-black text-blue-600 whitespace-nowrap bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                    {radius} km
                  </span>
                </div>
              ) : (
                <CitySelect
                  {...location}
                  onLocationChange={(loc) => {
                    setLocation(loc);
                    setUserLocation(null);
                    setIsNearByActive(false);
                  }}
                />
              )}
            </div>
          </div>

          {/* Search Button Column */}
          <div className="md:col-span-12 lg:col-span-3 p-2">
            <button
              onClick={() => handleSearch()}
              className="w-full h-[56px] bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.5)] active:scale-[0.98] flex items-center justify-center gap-3 group/btn"
            >
              <div className="bg-white/20 p-2 rounded-xl group-hover/btn:rotate-12 transition-transform">
                <Search size={20} strokeWidth={3} />
              </div>
              <span className="text-lg">Search Pros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isManualSearch
              ? (helpers.length > 0 ? `Found ${helpers.length} Professionals` : 'No Professionals Found')
              : (detectedCity ? `Top Rated Professionals in ${detectedCity}` : 'Top Rated Professionals')
            }
          </h2>

          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setShowMap(false)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!showMap ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              List View
            </button>
            <button
              onClick={() => setShowMap(true)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${showMap ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Map View
            </button>
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
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-gray-500 font-medium tracking-wide">
                  {isCityDetecting ? 'Detecting your location...' : 'Finding best professionals for you...'}
                </p>
              </div>
            )}


            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-600">
                <p className="font-medium">Unable to load professionals.</p>
                <p className="text-sm mt-1">Please ensure the backend server is running.</p>
              </div>
            )}

            {helpers.length === 0 && !isAnyLoading && !error && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No professionals found</h3>
                <p className="text-gray-500">
                  {isManualSearch
                    ? 'Try adjusting your search criteria or location.'
                    : `We couldn't find any professionals in ${detectedCity || 'your area'}.`}
                </p>
              </div>
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpers.map((helper: any) => (
                <div key={helper.id} className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-blue-50">
                        {helper.profileImage ? (
                          <img src={helper.profileImage} alt={helper.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-xl">
                            {helper.fullName?.[0]}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full border-2 border-white" title="Verified Pro">
                        <Shield size={12} fill="currentColor" />
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg text-sm font-bold">
                        <Star size={14} fill="currentColor" className="text-amber-400" />
                        <span>4.8</span>
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{helper.jobsCompleted || 0} jobs completed</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{helper.fullName}</h3>
                    <p className="text-blue-600 font-medium text-sm mb-2">{helper.headline}</p>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                      <MapPin size={10} />
                      {helper.city}, {helper.region}
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{helper.bio}</p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-600">
                      <Award size={14} className="text-gray-400" />
                      {helper.experienceYears} Yrs Exp.
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg text-xs font-medium text-green-700">
                      Rs. {helper.ratePerHour}/hr
                    </span>
                  </div>

                  <Link
                    href={`/helper/${helper.id}`}
                    className="mt-6 w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all text-center text-sm"
                  >
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <LocationPermissionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDetect={detectLocation}
        onManualSelect={(loc) => {
          setLocation(loc);
          setUserLocation(null);
          setIsNearByActive(false);
          handleSearch(loc);
          setIsModalOpen(false);
        }}
        isDetecting={isDetecting}
        error={locationError}
      />
    </div>
  );
}
