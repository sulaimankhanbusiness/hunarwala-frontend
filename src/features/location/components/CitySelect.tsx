'use client';
import { useQuery } from '@tanstack/react-query';
import { getCountries, getRegions, getCities } from '../services/location.service';
import { MapPin, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CitySelectProps {
  country: string;
  region: string;
  city: string;
  onLocationChange: (location: { country: string; region: string; city: string }) => void;
}

export default function CitySelect({ country, region, city, onLocationChange }: CitySelectProps) {
  const [selectedCountryId, setSelectedCountryId] = useState<number | ''>('');
  const [selectedRegionId, setSelectedRegionId] = useState<number | ''>('');

  const { data: countries } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries
  });

  const { data: regions, isLoading: isLoadingRegions } = useQuery({
    queryKey: ['regions', selectedCountryId],
    queryFn: () => getRegions(selectedCountryId as number),
    enabled: typeof selectedCountryId === 'number'
  });

  const { data: cities, isLoading: isLoadingCities } = useQuery({
    queryKey: ['cities', selectedRegionId],
    queryFn: () => getCities(selectedRegionId as number),
    enabled: typeof selectedRegionId === 'number'
  });

  // Handle Country Change
  const handleCountryChange = (id: string) => {
    const numId = id ? parseInt(id) : '';
    const countryName = countries?.find((c: any) => c.id === numId)?.name || '';
    setSelectedCountryId(numId);
    setSelectedRegionId('');
    onLocationChange({ country: countryName, region: '', city: '' });
  };

  // Handle Region Change
  const handleRegionChange = (id: string) => {
    const numId = id ? parseInt(id) : '';
    const regionName = regions?.find((r: any) => r.id === numId)?.name || '';
    setSelectedRegionId(numId);
    onLocationChange({ country, region: regionName, city: '' });
  };

  const selectClasses = "w-full h-full pl-10 pr-8 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-400 transition-all font-medium text-gray-900 appearance-none cursor-pointer text-sm mb-2 last:mb-0";

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Country Select */}
      <div className="relative group h-[48px]">
        <MapPin className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        <select
          className={selectClasses}
          value={selectedCountryId}
          onChange={(e) => handleCountryChange(e.target.value)}
        >
          <option value="">Select Country</option>
          {countries?.map((country: any) => (
            <option key={country.id} value={country.id}>{country.name}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" size={18} />
      </div>

      {/* Region Select */}
      <div className="relative group h-[48px]">
        <MapPin className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        <select
          className={`${selectClasses} ${!selectedCountryId ? 'opacity-50 cursor-not-allowed' : ''}`}
          value={selectedRegionId}
          onChange={(e) => handleRegionChange(e.target.value)}
          disabled={!selectedCountryId || isLoadingRegions}
        >
          <option value="">Select Region</option>
          {regions?.map((region: any) => (
            <option key={region.id} value={region.id}>{region.name}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" size={18} />
      </div>

      {/* City Select */}
      <div className="relative group h-[48px]">
        <MapPin className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        <select
          className={`${selectClasses} ${!selectedRegionId ? 'opacity-50 cursor-not-allowed' : ''}`}
          value={city}
          onChange={(e) => onLocationChange({ country, region, city: e.target.value })}
          disabled={!selectedRegionId || isLoadingCities}
        >
          <option value="">Select City</option>
          {cities?.map((city: any) => (
            <option key={city.id} value={city.name}>{city.name}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" size={18} />
      </div>
    </div>
  );
}

