import api from '@/lib/api';

/**
 * Constructs a full URL for media assets served by the backend.
 * Handles relative paths, absolute URLs, and blob URLs.
 * 
 * @param path The relative or absolute path to the media asset
 * @returns The full URL to the asset
 */
export function getMediaUrl(path: string | null | undefined): string {
    if (!path) return '';

    // If it's already a full URL or a blob URL, return it as is
    if (
        path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('blob:') ||
        path.startsWith('data:')
    ) {
        return path;
    }

    // Get base URL from axios instance config if available, or fallback to default
    // We remove /api if it exists because static files are usually served from the root
    const baseURL = (api.defaults.baseURL || 'http://localhost:3000').replace(/\/api$/, '');

    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${baseURL}${normalizedPath}`;
}
