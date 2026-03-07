'use client';

import { useState } from 'react';
import { MapPin, Shield, AlertTriangle, X, Settings2, Search, Loader2 } from 'lucide-react';
import CitySelect from './CitySelect';

interface LocationPermissionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDetect: () => void;
    onManualSelect: (location: { country: string; region: string; city: string }) => void;
    isDetecting: boolean;
    error?: { code: number; message: string } | null;
}

export default function LocationPermissionsModal({
    isOpen,
    onClose,
    onDetect,
    onManualSelect,
    isDetecting,
    error
}: LocationPermissionsModalProps) {
    const [showManual, setShowManual] = useState(false);
    const [manualLoc, setManualLoc] = useState({ country: '', region: '', city: '' });

    if (!isOpen) return null;

    const getErrorContent = () => {
        if (!error) return null;
        if (error.code === 1) { // PERMISSION_DENIED
            return {
                title: 'Location Access Denied',
                description: 'You have denied location access. To find professionals near you, please enable location permissions in your browser bar or system settings.',
                icon: <Shield className="text-red-500" size={32} />,
                instructions: [
                    'Click the lock/settings icon in your browser URL bar',
                    'Search for "Location" and set it to "Allow"',
                    'Refresh the page'
                ]
            };
        }

        if (error.code === 2 || error.code === 3) { // POSITION_UNAVAILABLE or TIMEOUT
            return {
                title: 'Location Unavailable',
                description: 'We could not detect your precise location. This can happen on desktop devices or due to system privacy settings.',
                icon: <AlertTriangle className="text-amber-500" size={32} />,
                instructions: [
                    'Ensure WiFi is turned on',
                    'Check System Settings → Privacy & Security → Location Services',
                    'Make sure your browser is allowed to access location'
                ]
            };
        }

        return {
            title: 'Detection Failed',
            description: error.message || 'An unexpected error occurred while detecting your location.',
            icon: <AlertTriangle className="text-amber-500" size={32} />,
            instructions: ['Please try again or select your city manually.']
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
                            {error ? errorContent?.description : 'Allow location access to see the best rated professionals in your immediate area.'}
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
                            <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest pl-1">Select City Manually</label>
                            <CitySelect
                                {...manualLoc}
                                onLocationChange={(loc) => {
                                    setManualLoc(loc);
                                    // Only trigger final selection and close if a city is picked
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
                            <button
                                onClick={onDetect}
                                disabled={isDetecting}
                                className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 group"
                            >
                                {isDetecting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Detecting Location...</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-white/20 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                                            <Target size={18} />
                                        </div>
                                        <span>{error ? 'Try Again' : 'Detect My Location'}</span>
                                    </>
                                )}
                            </button>

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

function Target({ size }: { size: number }) {
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
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
        </svg>
    );
}
