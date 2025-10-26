import React, { useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { PackageDestination } from '../../types';

// Default Leaflet marker fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface JourneyMapProps {
  destinations: PackageDestination[];
  height?: string | number;
}

export function JourneyMap({ destinations, height = 360 }: JourneyMapProps) {
  const points: [number, number, string][] = useMemo(() => {
    return (destinations || [])
      .map(d => {
        const lat = (d.location as any)?.latitude;
        const lng = (d.location as any)?.longitude;
        const label = (d.location as any)?.island || 'Stop';
        if (typeof lat === 'number' && typeof lng === 'number') {
          return [lat, lng, label] as [number, number, string];
        }
        return null;
      })
      .filter(Boolean) as [number, number, string][];
  }, [destinations]);

  const center: [number, number] = useMemo(() => {
    if (points.length > 0) return [points[0][0], points[0][1]];
    // Maldives default
    return [3.2028, 73.2207];
  }, [points]);

  const polyline = useMemo(() => points.map(p => [p[0], p[1]] as [number, number]), [points]);

  if (points.length === 0) return null;

  return (
    <Box borderRadius="lg" overflow="hidden" border="1px solid" borderColor="gray.200">
      <div style={{ height }}>
        <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {polyline.length > 1 && (
            <Polyline positions={polyline} pathOptions={{ color: '#7c3aed', weight: 4, opacity: 0.7 }} />
          )}

          {points.map(([lat, lng, label], idx) => (
            <Marker position={[lat, lng]} key={`${lat}-${lng}-${idx}`}>
              <Popup>
                <div style={{ minWidth: 160 }}>
                  <strong>{`Stop ${idx + 1}`}</strong>
                  <div style={{ color: '#4b5563' }}>{label}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </Box>
  );
}
