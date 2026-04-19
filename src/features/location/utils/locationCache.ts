const LOCATION_CACHE_KEY = 'hw_location_cache';
const CACHE_TTL_MS = 1 * 60 * 60 * 1000; // 1 hour

export interface LocationCache {
  city: string;
  lat: number;
  lng: number;
  timestamp: number;
}

export function getCachedLocation(): LocationCache | null {
  try {
    const raw = localStorage.getItem(LOCATION_CACHE_KEY);
    if (!raw) return null;
    const cache: LocationCache = JSON.parse(raw);
    if (Date.now() - cache.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(LOCATION_CACHE_KEY);
      return null;
    }
    return cache;
  } catch {
    return null;
  }
}

export function setCachedLocation(city: string, lat: number, lng: number): void {
  try {
    const entry: LocationCache = { city, lat, lng, timestamp: Date.now() };
    localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage unavailable — non-critical
  }
}
