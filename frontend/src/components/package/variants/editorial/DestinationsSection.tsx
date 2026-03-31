import React from 'react';
import { MapPinIcon, CheckCircleIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';
import { getDestinationColor } from '../../utils/packageSectionUtils';
import { GoogleMap } from '../../GoogleMap';
import type { PackageDestination } from '../../../../types';

const TONE_TEXT: Record<string, string> = {
  blue: 'text-sky-600',
  green: 'text-emerald-600',
  sky: 'text-sky-600',
  orange: 'text-orange-600',
  teal: 'text-teal-600',
  pink: 'text-pink-600',
};

interface DestinationsSectionProps {
  destinations: PackageDestination[];
  hideHeader?: boolean;
}

export function DestinationsSection({ destinations }: DestinationsSectionProps) {
  const theme = usePackageDetailVariant();

  if (!destinations || destinations.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      <GoogleMap destinations={destinations} height={320} />
      <div className="flex flex-col gap-8">
        {destinations.map((dest, index) => {
          const colorKey = getDestinationColor(index);
          const iconTone = TONE_TEXT[colorKey] ?? 'text-editorial-forest';
          const location = dest.location;
          const name = location?.island || `Destination ${index + 1}`;
          return (
            <div
              key={dest.id || index}
              className="border-b border-editorial-espresso/10 py-6 last:border-b-0"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <MapPinIcon className={`h-5 w-5 shrink-0 ${iconTone}`} aria-hidden />
                <h4
                  className="text-xl font-semibold text-editorial-espresso md:text-2xl"
                  style={{ fontFamily: theme.fonts.heading }}
                >
                  {name}
                </h4>
                <span className="font-body text-sm text-editorial-espresso/60">
                  {dest.duration} day{dest.duration > 1 ? 's' : ''}
                </span>
              </div>
              {location?.atoll && (
                <p className="mb-2 font-body text-sm text-editorial-espresso/60">{location.atoll} Atoll</p>
              )}
              {dest.description && (
                <p
                  className="mb-4 font-body leading-relaxed text-editorial-espresso/75"
                  style={{ lineHeight: 1.7 }}
                >
                  {dest.description}
                </p>
              )}
              {dest.highlights && dest.highlights.length > 0 && (
                <ul className="flex flex-col gap-1">
                  {dest.highlights.slice(0, 4).map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircleIcon className={`mt-0.5 h-4 w-4 shrink-0 ${iconTone}`} aria-hidden />
                      <span className="font-body text-sm text-editorial-espresso/70">{h}</span>
                    </li>
                  ))}
                </ul>
              )}
              {dest.activities && dest.activities.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <GlobeAltIcon className="h-4 w-4 shrink-0 text-editorial-espresso/45" aria-hidden />
                  <p className="font-body text-xs text-editorial-espresso/65">
                    {dest.activities.slice(0, 4).join(' · ')}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
