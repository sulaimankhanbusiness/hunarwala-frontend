'use client';

import { useState, useEffect } from 'react';
import { MapPin, Shield, AlertTriangle, X, Settings2, Search, Loader2 } from 'lucide-react';
import CitySelect from './CitySelect';
import {
  getCurrentCoordinates,
  queryGeolocationPermission,
} from '@/features/location/services/location.service';

interface LocationPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called with the resolved GeolocationPosition on success — parent handles reverse geocode etc. */
  onSuccess: (position: GeolocationPosition) => void;
  onManualSelect: (location: { country: string; region: string; city: string }) => void;
}

type ErrorState = { code: number; message: string } | null;

export default function LocationPermissionsModal({
  isOpen,
  onClose,
  onSuccess,
  onManualSelect,
}: LocationPermissionsModalProps) {
  const [showManual, setShowManual] = useState(false);
  const [manualLoc, setManualLoc] = useState({ country: '', region: '', city: '' });
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<ErrorState>(null);

  // On open: silently check permission state — show correct UI without triggering a prompt
  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setShowManual(false);

    (async () => {
      const { state } = await queryGeolocationPermission();
      if (state === 'unsupported') {
        setError({ code: 2, message: 'Geolocation is not supported by this browser.' });
      } else if (state === 'denied') {
        setError({
          code: GeolocationPositionError.PERMISSION_DENIED,
          message: 'Location access has been blocked in your browser settings.',
        });
      }
    })();
  }, [isOpen]);

  const handleDetect = async () => {
    setIsDetecting(true);
    setError(null);
    try {
      const position = await getCurrentCoordinates();
      onSuccess(position);
      onClose();
    } catch (err) {
      const geoErr = err as GeolocationPositionError;
      setError({
        code: 'code' in geoErr ? geoErr.code : 0,
        message: geoErr.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsDetecting(false);
    }
  };

  if (!isOpen) return null;

  const isDenied = error?.code === GeolocationPositionError.PERMISSION_DENIED;

  const getErrorContent = () => {
    if (!error) return null;

    if (error.code === GeolocationPositionError.PERMISSION_DENIED) {
      return {
        title: 'Location Access Denied',
        description:
          'You have denied location access. To find professionals near you, please enable location permissions in your browser or system settings.',
        icon: <Shield className="text-red-500" size={32} />,
        instructions: [
          'Click the lock/info icon in your browser URL bar',
          'Find "Location" and set it to "Allow"',
          'Reload the page and try again',
        ],
      };
    }

    if (
      error.code === GeolocationPositionError.POSITION_UNAVAILABLE ||
      error.code === GeolocationPositionError.TIMEOUT
    ) {
      return {
        title: 'Location Unavailable',
        description:
          'We could not detect your precise location. This can happen on desktop devices or due to privacy settings.',
        icon: <AlertTriangle className="text-amber-500" size={32} />,
        instructions: [
          'Make sure Wi-Fi is enabled (helps with network-based location)',
          'Check System Settings → Privacy & Security → Location Services',
          'Ensure your browser is allowed to access location',
        ],
      };
    }

    return {
      title: 'Detection Failed',
      description: error.message || 'An unexpected error occurred while detecting your location.',
      icon: <AlertTriangle className="text-amber-500" size={32} />,
      instructions: ['Please try again or select your city manually.'],
    };
  };

  const errorContent = getErrorContent();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="relative p-6 border-b border-gray-100">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className={`p-4 rounded-2xl mb-4 ${error ? 'bg-red-50' : 'bg-blue-50'}`}>
              {error ? errorContent?.icon : <MapPin className="text-blue-600" size={32} />}
            </div>
            <h2 className="text-2xl font-black text-gray-900 leading-tight">
              {error ? errorContent?.title : 'Find Pros Near You'}
            </h2>
            <p className="mt-2 text-gray-500 font-medium">
              {error
                ? errorContent?.description
                : 'Allow location access to see the best rated professionals in your immediate area.'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {errorContent?.instructions && (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-sm mb-3">
                <Settings2 size={16} className="text-blue-600" />
                How to fix this:
              </div>
              <ul className="space-y-2">
                {errorContent.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-600">
                    <span className="flex-shrink-0 w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-600">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showManual ? (
            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
              <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest pl-1">
                Select City Manually
              </label>
              <CitySelect
                {...manualLoc}
                onLocationChange={(loc) => {
                  setManualLoc(loc);
                  if (loc.city) {
                    onManualSelect(loc);
                    onClose();
                  }
                }}
              />
              <button
                onClick={() => setShowManual(false)}
                className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors w-full text-center"
              >
                Back to auto-detection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {/* Hidden when permission is permanently denied — retrying won't help */}
              {!isDenied && (
                <button
                  onClick={handleDetect}
                  disabled={isDetecting}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 group"
                >
                  {isDetecting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Detecting Location…</span>
                    </>
                  ) : (
                    <>
                      <div className="bg-white/20 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                        <TargetIcon size={18} />
                      </div>
                      <span>{error ? 'Try Again' : 'Detect My Location'}</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => setShowManual(true)}
                className="w-full h-14 bg-white border-2 border-gray-100 hover:border-blue-600 hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 group"
              >
                <div className="bg-gray-100 group-hover:bg-blue-100 p-1.5 rounded-lg transition-colors">
                  <Search size={18} />
                </div>
                <span>Select City Manually</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50/50 flex justify-center border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-medium text-center max-w-[280px]">
            We value your privacy. Location data is only used to find local professionals and is not stored permanently.
          </p>
        </div>
      </div>
    </div>
  );
}

function TargetIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2" /><path d="M12 20v2" />
      <path d="M2 12h2" /><path d="M20 12h2" />
    </svg>
  );
}