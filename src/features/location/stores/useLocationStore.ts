import { create } from 'zustand';
import { getCountries, getRegions, getCities, getCityByName } from '../services/location.service';

interface LocationState {
    countries: any[];
    regions: any[];
    cities: any[];

    selectedCountryId: string;
    selectedRegionId: string;
    selectedCityId: string;

    isLoadingCountries: boolean;
    isLoadingRegions: boolean;
    isLoadingCities: boolean;
    isResolving: boolean;

    // Actions
    fetchCountries: () => Promise<void>;
    fetchRegions: (countryId: number) => Promise<void>;
    fetchCities: (regionId: number) => Promise<void>;

    setSelectedCountry: (id: string) => void;
    setSelectedRegion: (id: string) => void;
    setSelectedCity: (id: string) => void;

    resolveLocationFromCity: (cityName: string, location?: {countryName: string; countryCode: string; principalSubdivision: string}   ) => Promise<void>;
    reset: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
    countries: [],
    regions: [],
    cities: [],

    selectedCountryId: '',
    selectedRegionId: '',
    selectedCityId: '',

    isLoadingCountries: false,
    isLoadingRegions: false,
    isLoadingCities: false,
    isResolving: false,

    fetchCountries: async () => {
        set({ isLoadingCountries: true });
        try {
            const res = await getCountries();
            set({ countries: res });
        } finally {
            set({ isLoadingCountries: false });
        }
    },

    fetchRegions: async (countryId: number) => {
        set({ isLoadingRegions: true });
        try {
            const res = await getRegions(countryId);
            set({
                regions: res,
                cities: [],
                selectedRegionId: '',
                selectedCityId: ''
            });
        } finally {
            set({ isLoadingRegions: false });
        }
    },

    fetchCities: async (regionId: number) => {
        set({ isLoadingCities: true });
        try {
            const res = await getCities(regionId);
            set({ cities: res, selectedCityId: '' });
        } finally {
            set({ isLoadingCities: false });
        }
    },

    setSelectedCountry: (id: string) => set({ selectedCountryId: id }),
    setSelectedRegion: (id: string) => set({ selectedRegionId: id }),
    setSelectedCity: (id: string) => set({ selectedCityId: id }),

    resolveLocationFromCity: async (cityName: string, location?: {countryName: string; countryCode: string; principalSubdivision: string} ) => {
        set({ isResolving: true });
        try {
            const cityRes = await getCityByName(cityName,location?.countryName, location?.countryCode, location?.principalSubdivision);
            const cityData = cityRes.data || cityRes;

            if (cityData) {
                const countryId = cityData.region.countryId;
                const regionId = cityData.regionId;
                const cityId = cityData.id;

                // 1. Fetch regions and cities in parallel (or sequential but before setting IDs)
                const [regionsList, citiesList] = await Promise.all([
                    getRegions(countryId),
                    getCities(regionId)
                ]);

                // 2. Update all state together to ensure consistency
                set({
                    selectedCountryId: countryId.toString(),
                    regions: regionsList,
                    selectedRegionId: regionId.toString(),
                    cities: citiesList,
                    selectedCityId: cityId.toString(),
                });
            }
        } catch (error) {
            console.error('Error resolving location from city:', error);
        } finally {
            set({ isResolving: false });
        }
    },

    reset: () => set({
        selectedCountryId: '',
        selectedRegionId: '',
        selectedCityId: '',
        regions: [],
        cities: []
    })
}));
