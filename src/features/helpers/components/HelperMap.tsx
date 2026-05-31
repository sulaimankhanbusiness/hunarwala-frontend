'use client';

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, ScaleControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Star, Navigation, Map as MapIcon, ExternalLink } from 'lucide-react';
import { getMediaUrl } from '@/utils/url';

// Deferred to avoid window-access at module level during SSR
const getDefaultIcon = () => L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface HelperMapProps {
    helpers: any[];
    center?: { lat: number; lng: number };
    userLocation?: { lat: number; lng: number } | null;
}

// Component to handle map center updates and fitting bounds
function MapController({ helpers, userLocation }: { helpers: any[], userLocation?: { lat: number; lng: number } | null }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const points: L.LatLngExpression[] = [];

        // Add helper points
        helpers.forEach(h => {
            const lat = h.latitude ? parseFloat(h.latitude) : null;
            const lng = h.longitude ? parseFloat(h.longitude) : null;
            if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
                points.push([lat, lng]);
            }
        });

        if (points.length === 0 && userLocation) {
            points.push([userLocation.lat, userLocation.lng]);
        }

        if (points.length > 0) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
    }, [helpers, userLocation, map]);

    return null;
}

// Custom control for centering on user location
function LocateControl({ userLocation }: { userLocation?: { lat: number; lng: number } | null }) {
    const map = useMap();

    const handleLocate = useCallback(() => {
        if (userLocation) {
            map.flyTo([userLocation.lat, userLocation.lng], 14);
        } else {
            map.locate({ setView: true, maxZoom: 14 });
        }
    }, [map, userLocation]);

    return (
        <div className="leaflet-top leaflet-right mt-12 mr-0">
            <div className="leaflet-control leaflet-bar">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleLocate();
                    }}
                    title="Locate me"
                    className="w-11 h-10 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-md rounded-lg"
                >
                    <Navigation size={18} className="text-blue-600" />
                </button>
            </div>
        </div>
    );
}

export default function HelperMap({ helpers = [], userLocation, center = { lat: 30.3753, lng: 69.3451 } }: HelperMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-2xl" />;

    const mapKey = helpers.length > 0 ? `map-${helpers.length}-${helpers[0].id}` : 'map-empty';

    const getStreetViewUrl = (lat: number, lng: number) => {
        return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
    };

    return (
        <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 z-0 relative group">
            <MapContainer
                key={mapKey}
                center={[center.lat, center.lng]}
                zoom={5}
                scrollWheelZoom={true} // Enabled scroll zoom for better exploration
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Standard Map">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Satellite View">
                        <TileLayer
                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Terrain Map">
                        <TileLayer
                            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>

                <ScaleControl position="bottomleft" />
                <MapController helpers={helpers} userLocation={userLocation} />
                <LocateControl userLocation={userLocation} />

                {/* User Current Location Marker */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={getDefaultIcon()}>
                        <Popup>
                            <div className="font-bold text-blue-600">You are here</div>
                        </Popup>
                    </Marker>
                )}

                <MarkerClusterGroup
                    chunkedLoading
                    maxClusterRadius={50}
                    spiderfyOnMaxZoom={true}
                >
                    {helpers.map((helper) => {
                        const lat = helper.latitude ? parseFloat(helper.latitude) : null;
                        const lng = helper.longitude ? parseFloat(helper.longitude) : null;

                        if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) return null;

                        return (
                            <Marker
                                key={`${helper.id}-${lat}-${lng}`}
                                position={[lat, lng]}
                                icon={getDefaultIcon()}
                            >
                                <Popup minWidth={220}>
                                    <div className="p-2">
                                        <div className="flex items-center gap-3 mb-3 border-b pb-2">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-50 ring-2 ring-blue-100 shadow-sm">
                                                {helper.profileImage ? (
                                                    <img src={getMediaUrl(helper.profileImage)} alt={helper.fullName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                                        {helper.fullName?.[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm">{helper.fullName}</h3>
                                                <p className="text-[10px] text-blue-600 font-medium">{helper.headline}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mb-3">
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Rate</p>
                                                <p className="text-xs font-bold text-green-600">Rs. {helper.dailyRate}/day</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Rating</p>
                                                <div className="flex items-center gap-0.5 text-amber-500">
                                                    <Star size={12} fill="currentColor" />
                                                    <span className="text-xs font-bold">4.8</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <a
                                                href={getStreetViewUrl(lat, lng)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full py-1.5 px-3 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors border border-amber-200"
                                            >
                                                <MapIcon size={14} />
                                                See Street View
                                                <ExternalLink size={12} className="ml-auto opacity-50" />
                                            </a>

                                            <button
                                                className="w-full py-1.5 px-3 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                                                onClick={() => window.location.href = `/helper/${helper.id}`}
                                            >
                                                View Full Profile
                                            </button>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MarkerClusterGroup>
            </MapContainer>

            {/* Custom overlay hints */}
            <div className="absolute bottom-4 right-4 z-[400] bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-lg border border-white/50 text-[10px] font-medium text-gray-600 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                Switch layers in the top right
            </div>
        </div>
    );
}



