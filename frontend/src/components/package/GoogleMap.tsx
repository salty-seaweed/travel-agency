import React, { useEffect, useRef, useState } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import type { PackageDestination } from '../../types';

interface GoogleMapProps {
  destinations: PackageDestination[];
  height?: string | number;
  apiKey?: string;
}

interface MapsLatLngLiteral {
  lat: number;
  lng: number;
}

interface MapsMap {
  fitBounds: (bounds: MapsLatLngBounds) => void;
  getZoom: () => number;
  setZoom: (z: number) => void;
}

interface MapsLatLngBounds {
  extend: (p: MapsLatLngLiteral) => void;
}

interface MapsMarker {
  addListener: (ev: 'click', fn: () => void) => void;
}

interface MapsInfoWindow {
  open: (map: MapsMap, marker: MapsMarker) => void;
  close: () => void;
}

interface GoogleMapsMapsNs {
  Map: new (el: HTMLElement, opts: Record<string, unknown>) => MapsMap;
  MapTypeId: { ROADMAP: string };
  LatLngBounds: new () => MapsLatLngBounds;
  Marker: new (opts: Record<string, unknown>) => MapsMarker;
  InfoWindow: new (opts: { content: string }) => MapsInfoWindow;
  Polyline: new (opts: Record<string, unknown>) => void;
  SymbolPath: { CIRCLE: unknown };
  event: {
    addListener: (target: MapsMap, ev: 'idle', fn: () => void) => unknown;
    removeListener: (listener: unknown) => void;
  };
}

declare global {
  interface Window {
    google?: { maps: GoogleMapsMapsNs };
    initGoogleMaps?: () => void;
  }
}

interface MapPoint extends MapsLatLngLiteral {
  label: string;
}

function extractMapPoints(destinations: PackageDestination[]): MapPoint[] {
  return destinations
    .map((d) => {
      const { latitude: lat, longitude: lng, island } = d.location;
      if (
        typeof lat === 'number' &&
        typeof lng === 'number' &&
        Number.isFinite(lat) &&
        Number.isFinite(lng)
      ) {
        return { lat, lng, label: island || 'Stop' };
      }
      return null;
    })
    .filter((p): p is MapPoint => p !== null);
}

function journeyPointsFromDestinations(
  destinations: PackageDestination[]
): Array<{ label: string; atoll: string; description: string; duration: number }> {
  return destinations.map((d, index) => ({
    label: d.location?.island || `Destination ${index + 1}`,
    atoll: d.location?.atoll || '',
    description: d.description || '',
    duration: d.duration || 0,
  }));
}

export function GoogleMap({ destinations, height = 360, apiKey }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const googleApiKey = apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!googleApiKey || googleApiKey === 'AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgHz-TrU_T4') {
      console.warn('No valid Google Maps API key provided, showing journey route only');
      setMapError(true);
      setIsLoading(false);
      return;
    }

    const initializeMap = () => {
      const maps = window.google?.maps;
      if (!mapRef.current || !maps) return;

      setIsLoading(false);

      const points = extractMapPoints(destinations);
      const center: MapsLatLngLiteral =
        points.length > 0 ? { lat: points[0].lat, lng: points[0].lng } : { lat: 3.2028, lng: 73.2207 };

      const map = new maps.Map(mapRef.current, {
        zoom: points.length > 1 ? 8 : 10,
        center,
        mapTypeId: maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#e9e9e9' }, { lightness: 17 }],
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }, { lightness: 20 }],
          },
        ],
      });

      const markers: Array<{ infoWindow: MapsInfoWindow }> = [];
      const bounds = new maps.LatLngBounds();

      points.forEach((point, index) => {
        const marker = new maps.Marker({
          position: { lat: point.lat, lng: point.lng },
          map,
          title: `Stop ${index + 1}: ${point.label}`,
          label: {
            text: `${index + 1}`,
            color: 'white',
            fontWeight: 'bold',
          },
          icon: {
            path: maps.SymbolPath.CIRCLE,
            fillColor: '#1e3d36',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 12,
          },
        });

        const infoWindow = new maps.InfoWindow({
          content: `
            <div style="padding: 8px; min-width: 120px;">
              <strong>Stop ${index + 1}</strong><br/>
              <span style="color: #666;">${point.label}</span>
            </div>
          `,
        });

        marker.addListener('click', () => {
          markers.forEach((m) => m.infoWindow.close());
          infoWindow.open(map, marker);
        });

        markers.push({ infoWindow });
        bounds.extend({ lat: point.lat, lng: point.lng });
      });

      if (points.length > 1) {
        const path = points.map((p) => ({ lat: p.lat, lng: p.lng }));
        new maps.Polyline({
          path,
          geodesic: true,
          strokeColor: '#1e3d36',
          strokeOpacity: 1.0,
          strokeWeight: 3,
          map,
        });
        map.fitBounds(bounds);
        const listener = maps.event.addListener(map, 'idle', () => {
          if (map.getZoom() > 12) map.setZoom(12);
          maps.event.removeListener(listener);
        });
      }
    };

    if (window.google?.maps) {
      initializeMap();
      return;
    }

    window.initGoogleMaps = initializeMap;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.warn('Failed to load Google Maps, showing destination list instead');
      setMapError(true);
      setIsLoading(false);
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window.initGoogleMaps;
    };
  }, [destinations, apiKey]);

  if (!destinations || destinations.length === 0) {
    return null;
  }

  const points = journeyPointsFromDestinations(destinations);

  const journeyRoute = (
    <div className="rounded-2xl border border-editorial-espresso/10 bg-gradient-to-br from-editorial-mist/80 via-editorial-sand/40 to-editorial-parchment/50 p-6 shadow-sm">
      <div className="mb-5 text-center">
        <h3 className="font-display text-xl font-semibold text-editorial-espresso md:text-2xl">
          Journey route
        </h3>
        <p className="mt-2 font-body text-sm text-editorial-espresso/65">
          Your adventure through {points.length} amazing{' '}
          {points.length === 1 ? 'destination' : 'destinations'}
        </p>
      </div>

      <ul className="flex flex-col gap-4">
        {points.map((point, index) => (
          <li key={index} className="relative list-none">
            <div className="rounded-xl border border-editorial-espresso/10 bg-white/95 p-4 shadow-sm transition hover:border-editorial-forest/25 hover:shadow-md">
              <div className="flex gap-3">
                <div
                  className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full bg-editorial-forest text-sm font-bold text-white"
                  aria-hidden
                >
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-body font-semibold text-editorial-espresso">{point.label}</span>
                    {point.duration > 0 && (
                      <span className="rounded-full bg-editorial-mist px-2.5 py-0.5 text-xs font-semibold text-editorial-forest">
                        {point.duration} {point.duration === 1 ? 'day' : 'days'}
                      </span>
                    )}
                  </div>
                  {point.atoll && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-editorial-sand px-2 py-0.5 font-body text-xs font-medium text-editorial-espresso">
                      <MapPinIcon className="h-3.5 w-3.5 text-editorial-terracotta" aria-hidden />
                      {point.atoll}
                    </span>
                  )}
                  {point.description && (
                    <p className="font-body text-sm leading-relaxed text-editorial-espresso/70">
                      {point.description.length > 100
                        ? `${point.description.slice(0, 100)}…`
                        : point.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {index < points.length - 1 && (
              <div
                className="absolute bottom-[-16px] left-[19px] z-[1] h-4 w-0.5 bg-editorial-forest/35"
                aria-hidden
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  if (mapError) {
    return (
      <div className="flex flex-col gap-6">
        {journeyRoute}
        <div className="rounded-xl border border-editorial-espresso/15 bg-editorial-sand/50 p-4 text-center">
          <p className="font-body text-sm font-medium text-editorial-espresso">Interactive map</p>
          <p className="mt-1 font-body text-xs text-editorial-espresso/60">Coming soon</p>
        </div>
      </div>
    );
  }

  const mapHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div className="flex flex-col gap-6">
      {journeyRoute}

      <div>
        <h3 className="mb-4 text-center font-display text-lg font-semibold text-editorial-espresso">
          Interactive map
        </h3>
        <div className="relative overflow-hidden rounded-2xl border border-editorial-espresso/10">
          {isLoading && (
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/95 px-4 py-3 shadow-md">
              <p className="font-body text-sm text-editorial-espresso/70">Loading map…</p>
            </div>
          )}
          <div ref={mapRef} className="w-full min-h-[300px]" style={{ height: mapHeight }} />
        </div>
      </div>
    </div>
  );
}
