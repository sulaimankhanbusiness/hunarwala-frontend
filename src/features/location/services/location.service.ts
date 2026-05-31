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

export const getCityByName = async (name: string, countryName?: string, countryCode?: string, principalSubdivision?: string) => {
  return api.get(`/location/city-by-name/${name}?countryName=${countryName}&countryCode=${countryCode}&principalSubdivision=${principalSubdivision}`) as Promise<any>;
};

export const getIpLocation = async () => {
  // Keeping this for backward compatibility if needed, but we'll use reverseGeocode mostly
  const response = await fetch('https://ipwho.is/');
  return response.json();
};

export interface GeolocationPermissionState {
  state: 'granted' | 'denied' | 'prompt' | 'unsupported';
}

/**
 * Silently checks the browser's permission state for geolocation
 * WITHOUT triggering a permission prompt.
 */
export const queryGeolocationPermission = async (): Promise<GeolocationPermissionState> => {
  if (!navigator.geolocation) return { state: 'unsupported' };
  if (!navigator.permissions) return { state: 'prompt' }; // Permissions API unavailable — assume neutral

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return { state: result.state };
  } catch {
    return { state: 'prompt' };
  }
};

const HIGH_ACCURACY_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10_000,
  maximumAge: 0,
};

const LOW_ACCURACY_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 8_000,
  maximumAge: 30_000, // accept a 30-second cached fix on retry
};

const tryGetPosition = (options: PositionOptions): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });

/**
 * Get the device's current coordinates.
 *
 * Strategy:
 *  1. Try high-accuracy (GPS).
 *  2. On POSITION_UNAVAILABLE (2) or TIMEOUT (3) → retry with low accuracy (WiFi/IP).
 *  3. On PERMISSION_DENIED (1) → reject immediately, no retry.
 *  4. Throws a GeolocationPositionError (with .code) so callers can branch on error type.
 */
export const getCurrentCoordinates = async (): Promise<GeolocationPosition> => {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by this browser.');
  }

  try {
    return await tryGetPosition(HIGH_ACCURACY_OPTIONS);
  } catch (err) {
    const geoError = err as GeolocationPositionError;

    // PERMISSION_DENIED — retrying is pointless
    if (geoError.code === GeolocationPositionError.PERMISSION_DENIED) {
      throw geoError;
    }

    // POSITION_UNAVAILABLE or TIMEOUT — worth one retry at lower accuracy
    if (
      geoError.code === GeolocationPositionError.POSITION_UNAVAILABLE ||
      geoError.code === GeolocationPositionError.TIMEOUT
    ) {
      console.warn(
        `[Geolocation] High-accuracy failed (code ${geoError.code}: ${geoError.message}). Retrying with low accuracy…`
      );
      return await tryGetPosition(LOW_ACCURACY_OPTIONS);
    }

    throw geoError; // UNKNOWN_ERROR or anything else
  }
};

// ─── Reverse Geocoding ────────────────────────────────────────────────────────

export const reverseGeocode = async (lat?: number, lng?: number) => {
  const query =
    lat !== undefined && lng !== undefined ? `latitude=${lat}&longitude=${lng}&` : '';
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?${query}localityLanguage=en`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch reverse geocode data');
  return response.json();
};
