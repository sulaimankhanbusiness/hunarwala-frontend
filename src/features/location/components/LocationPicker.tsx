'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, LayersControl, ScaleControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/error';
import { LocateFixed, MapPin, Layers } from 'lucide-react';
import { getCurrentCoordinates } from '../services/location.service';

// Fix for default marker icons
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface LocationPickerProps {
    value: { lat: number; lng: number } | null;
    onChange: (coords: { lat: number; lng: number }) => void;
    onDetectingChange?: (isDetecting: boolean) => void;
    onLocationDetected?: (lat: number, lng: number) => void;
    center?: { lat: number; lng: number };
}

function LocationMarker({ value, onChange }: { value: { lat: number; lng: number } | null, onChange: (coords: { lat: number; lng: number }) => void }) {
    useMapEvents({
        click(e) {
            onChange(e.latlng);
        },
    });

    return value === null ? null : (
        <Marker position={value} icon={DefaultIcon} />
    );
}

function ChangeView({ center, zoom = 13 }: { center: [number, number], zoom?: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function LocationPicker({
    value,
    onChange,
    onDetectingChange,
    onLocationDetected,
    center = { lat: 30.3753, lng: 69.3451 }
}: LocationPickerProps) {
    const [mapCenter, setMapCenter] = useState<[number, number]>([center.lat, center.lng]);
    const [isDetecting, setIsDetecting] = useState(false);
    const [detectionType, setDetectionType] = useState<'precise' | 'estimated' | 'manual' | null>(null);

    // Sync map center when prop changes (e.g. from city selection)
    useEffect(() => {
        if (center) {
            setMapCenter([center.lat, center.lng]);
            if (!value || (Math.abs(value.lat - center.lat) > 0.001)) {
                setDetectionType(null);
            }
        }
    }, [center.lat, center.lng]);

    const handleDetectLocation = async () => {
        setIsDetecting(true);
        onDetectingChange?.(true);

        try {
            const position = await getCurrentCoordinates();
            const { latitude, longitude } = position.coords;

            onChange({ lat: latitude, lng: longitude });
            onLocationDetected?.(latitude, longitude);
            setMapCenter([latitude, longitude]);
            setDetectionType('precise');
            toast.success('Location detected! 📍');
        } catch (err: any) {
            console.error("Location detection failed", err);
            toast.error(getErrorMessage(err, "Could not detect location. Please pin your location manually."));
        } finally {
            setIsDetecting(false);
            onDetectingChange?.(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 space-y-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-blue-700">
                        <MapPin size={18} />
                        <span className="text-sm font-medium">
                            {value ? `Fixed: ${value.lat.toFixed(4)}, ${value.lng.toFixed(4)}` : "Select your service center"}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={isDetecting}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-200 disabled:opacity-50"
                    >
                        {isDetecting ? (
                            <>
                                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                Detecting...
                            </>
                        ) : (
                            <>
                                <LocateFixed size={14} />
                                Use Location
                            </>
                        )}
                    </button>
                </div>

                {detectionType === 'estimated' && (
                    <div className="bg-amber-100/50 border border-amber-200 p-2 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                        <div className="text-amber-600 mt-0.5">⚠️</div>
                        <p className="text-[11px] text-amber-800 leading-tight">
                            <strong>Estimated location.</strong> Please drag the pin or click the map for your exact spot.
                        </p>
                    </div>
                )}

                {detectionType === 'precise' && (
                    <div className="bg-green-100/50 border border-green-200 p-2 rounded-lg flex items-center gap-2 animate-in fade-in">
                        <div className="text-green-600">✓</div>
                        <p className="text-[11px] text-green-800">Precise location detected successfully.</p>
                    </div>
                )}
            </div>

            <div className="h-[350px] w-full rounded-2xl overflow-hidden border-2 border-gray-100 shadow-xl z-0 relative group">
                <MapContainer
                    center={mapCenter}
                    zoom={value ? 16 : 13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <LayersControl position="topright">
                        <LayersControl.BaseLayer checked name="Standard">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Satellite">
                            <TileLayer
                                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>

                    <ScaleControl position="bottomleft" />
                    <LocationMarker value={value} onChange={onChange} />
                    <ChangeView center={mapCenter} zoom={value ? 16 : 13} />
                </MapContainer>

                <div className="absolute top-3 left-3 z-[400] bg-white/90 backdrop-blur px-2 py-1 rounded-md shadow-sm border border-gray-200 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                    <Layers size={12} />
                    SWITCH MAP VIEW TOP RIGHT
                </div>
            </div>

            <p className="text-[11px] text-gray-400 italic text-center">
                * Click anywhere on the map to accurately pin your service location.
            </p>
        </div>
    );
}
