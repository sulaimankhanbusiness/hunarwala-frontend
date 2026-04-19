'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { reverseGeocode } from '@/features/location/services/location.service';
import { toast } from 'sonner';
import { Loader2, Globe, Map as MapIcon, ChevronRight } from 'lucide-react';

const LocationPicker = dynamic(() => import('@/features/location/components/LocationPicker'), {
    ssr: false,
    loading: () => <div className="h-[350px] w-full bg-gray-100 animate-pulse rounded-2xl" />,
});
import { useLocationStore } from '@/features/location/stores/useLocationStore';

interface ServiceLocationInfoProps {
    onSubmit: (data: any) => void;
    onBack: () => void;
    isLoading: boolean;
}

export default function ServiceLocationInfo({ onSubmit, onBack, isLoading: isSubmitting }: ServiceLocationInfoProps) {
    const {
        countries,
        regions,
        cities,
        selectedCountryId,
        selectedRegionId,
        selectedCityId,
        fetchCountries,
        fetchRegions,
        fetchCities,
        setSelectedCountry,
        setSelectedRegion,
        setSelectedCity,
        resolveLocationFromCity,
        isResolving
    } = useLocationStore();

    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);
    const [isDetecting, setIsDetecting] = useState(false);

    useEffect(() => {
        fetchCountries();
    }, []);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedCountry(id);
        if (id) fetchRegions(parseInt(id));
    };

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedRegion(id);
        if (id) fetchCities(parseInt(id));
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedCity(id);
        // Find city to center map
        const city = cities.find(c => c.id.toString() === id);
        if (city && city.latitude && city.longitude) {
            setMapCenter({ lat: parseFloat(city.latitude), lng: parseFloat(city.longitude) });
            setCoords({ lat: parseFloat(city.latitude), lng: parseFloat(city.longitude) });
        }
    };

    const handleLocationDetected = async (lat: number, lng: number) => {
        try {
            const geoData = await reverseGeocode(lat, lng);
            if (geoData && geoData.city) {
                await resolveLocationFromCity(geoData.city);
                setCoords({ lat, lng });
                setMapCenter({ lat, lng });
            }
        } catch (error) {
            console.error('Error in handleLocationDetected:', error);
        }
    };

    const handleFinish = () => {
        if (!selectedCityId || !coords) {
            toast.error("Please select your city and pin your location on the map.");
            return;
        }
        onSubmit({
            cityId: parseInt(selectedCityId),
            latitude: coords.lat,
            longitude: coords.lng
        });
    };

    const isAnyLoading = isSubmitting || isDetecting || isResolving;

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Location</h2>
                <p className="text-gray-500 text-sm">Where do you provide your services?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-1 flex items-center gap-1">
                        <Globe size={12} /> Country
                    </label>
                    <select
                        value={selectedCountryId}
                        onChange={handleCountryChange}
                        disabled={isAnyLoading}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 transition-all outline-none bg-white text-sm font-semibold text-gray-700 disabled:bg-gray-50"
                    >
                        <option value="">Select Country</option>
                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Region/State</label>
                    <select
                        value={selectedRegionId}
                        onChange={handleRegionChange}
                        disabled={!selectedCountryId || isAnyLoading}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 transition-all outline-none bg-white text-sm font-semibold text-gray-700 disabled:bg-gray-50 disabled:text-gray-400"
                    >
                        <option value="">Select Region</option>
                        {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">City</label>
                    <select
                        value={selectedCityId}
                        onChange={handleCityChange}
                        disabled={!selectedRegionId || isAnyLoading}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 transition-all outline-none bg-white text-sm font-semibold text-gray-700 disabled:bg-gray-50 disabled:text-gray-400"
                    >
                        <option value="">Select City</option>
                        {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

            </div>

            <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider px-1 flex items-center gap-1">
                    <MapIcon size={12} /> Exact Service Pin
                </label>
                <div className="relative">
                    <LocationPicker
                        value={coords}
                        onChange={setCoords}
                        center={mapCenter}
                        onDetectingChange={setIsDetecting}
                        onLocationDetected={handleLocationDetected}
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isAnyLoading}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={handleFinish}
                    disabled={isAnyLoading}
                    className="flex-[2] bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {isAnyLoading ? <Loader2 className="animate-spin" size={20} /> : (
                        <>
                            Finish Registration
                            <ChevronRight size={18} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
