import api from '@/lib/api';

export const getCountries = async () => {
  return api.get('/location/countries') as Promise<any>;
};

export const getRegions = async (countryId: number) => {
  return api.get(`/location/countries/${countryId}/regions`) as Promise<any>;
};

export const getCities = async (regionId: number) => {
  return api.get(`/location/regions/${regionId}/cities`) as Promise<any>;
};

export const getCityByName = async (name: string) => {
  return api.get(`/location/city-by-name/${name}`) as Promise<any>;
};

export const getIpLocation = async () => {
  // Keeping this for backward compatibility if needed, but we'll use reverseGeocode mostly
  const response = await fetch('https://ipwho.is/');
  return response.json();
};

export const getCurrentCoordinates = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
};

export const reverseGeocode = async (lat?: number, lng?: number) => {
  const query = lat !== undefined && lng !== undefined
    ? `latitude=${lat}&longitude=${lng}&`
    : '';
  const url = `http://api.bigdatacloud.net/data/reverse-geocode-client?${query}localityLanguage=en`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch reverse geocode data');
  }
  return response.json();
};

