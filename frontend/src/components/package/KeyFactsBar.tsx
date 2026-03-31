import React from 'react';
import { CalendarIcon, MapPinIcon, UsersIcon, StarIcon } from '@heroicons/react/24/outline';
import { usePackageDetailVariant } from '../../contexts/PackageDetailVariantContext';
import type { Package } from '../../types';

interface KeyFactsBarProps {
  packageData: Package;
  variant?: 'light' | 'dark';
}

export function KeyFactsBar({ packageData, variant = 'light' }: KeyFactsBarProps) {
  const theme = usePackageDetailVariant();
  const isMinimal = theme.id === 'minimal';
  const isDark = variant === 'dark';

  const duration = packageData.duration || 1;
  const destCount = packageData.destinations?.length || 0;
  const groupMin = packageData.group_size?.min ?? 1;
  const groupMax = packageData.group_size?.max ?? 4;

  const facts = [
    { icon: CalendarIcon, value: `${duration} days`, label: 'Duration' },
    {
      icon: MapPinIcon,
      value: `${destCount} destination${destCount !== 1 ? 's' : ''}`,
      label: 'Destinations',
    },
    { icon: UsersIcon, value: `${groupMin}–${groupMax} people`, label: 'Group size' },
  ];

  const shellLight =
    'rounded-full border border-editorial-espresso/10 bg-white/90 px-3 py-2.5 shadow-sm backdrop-blur-sm';
  const shellLightBordered =
    'rounded-full border border-neutral-200/90 bg-editorial-linen/80 px-3 py-2.5 backdrop-blur-sm';
  const shellDark = 'rounded-full border border-white/20 bg-black/45 px-3 py-2.5 backdrop-blur-md';

  const outerClass = isDark
    ? shellDark
    : theme.section.cardStyle === 'bordered'
      ? shellLightBordered
      : shellLight;

  const textPrimary = isDark ? 'text-white' : 'text-editorial-espresso';
  const textMuted = isDark ? 'text-white/75' : 'text-editorial-espresso/55';
  const iconTone = isDark ? 'text-sky-300' : 'text-editorial-forest';

  const guestFavorite =
    packageData.rating != null &&
    packageData.rating >= 4.8 &&
    packageData.review_count != null &&
    packageData.review_count >= 10;

  const ratingBlock = packageData.rating != null && (
    <div className="flex flex-wrap items-center gap-2">
      {guestFavorite && (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
            isDark ? 'bg-emerald-500/90 text-white' : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          Guest favorite
        </span>
      )}
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium ${
          isDark ? 'bg-amber-400/95 text-amber-950' : 'bg-amber-100 text-amber-900'
        }`}
      >
        <StarIcon className="h-3.5 w-3.5" aria-hidden />
        {packageData.rating.toFixed(1)}
        {packageData.review_count != null && packageData.review_count > 0 && (
          <span className={isDark ? 'text-amber-950/80' : 'text-amber-900/75'}>
            ({packageData.review_count})
          </span>
        )}
      </span>
    </div>
  );

  if (theme.id === 'editorial' && !isMinimal) {
    return (
      <div
        className={`rounded-3xl border p-4 shadow-editorial backdrop-blur-sm md:p-5 ${
          isDark
            ? 'border-white/20 bg-black/50'
            : 'border-editorial-espresso/12 bg-white/92'
        }`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:justify-between lg:gap-6">
          <div className="flex flex-wrap items-center gap-3 lg:min-w-0 lg:shrink-0">
            <span
              className={`font-body text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-white/50' : 'text-editorial-espresso/45'}`}
            >
              Trip snapshot
            </span>
            {ratingBlock}
          </div>

          <div className="grid grid-cols-1 gap-3 xs:grid-cols-3 sm:grid-cols-3 lg:flex lg:flex-1 lg:justify-end lg:gap-0">
            {facts.map((fact, index) => (
              <div
                key={fact.label}
                className={`flex items-center gap-3 rounded-2xl px-3 py-3 sm:px-4 ${
                  isDark
                    ? 'bg-white/10 ring-1 ring-white/15'
                    : 'bg-editorial-sand/55 ring-1 ring-editorial-espresso/[0.06]'
                } lg:rounded-none lg:bg-transparent lg:py-2 lg:ring-0 ${
                  index > 0 ? 'lg:border-l lg:border-editorial-espresso/10 lg:pl-6' : ''
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isDark ? 'bg-white/15 text-sky-200' : 'bg-editorial-mist/80 text-editorial-forest'
                  }`}
                >
                  <fact.icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 leading-tight">
                  <p
                    className={`font-body text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-white/55' : 'text-editorial-espresso/50'}`}
                  >
                    {fact.label}
                  </p>
                  <p
                    className={`mt-0.5 font-display text-base font-semibold tracking-tight sm:text-lg ${isDark ? 'text-white' : 'text-editorial-espresso'}`}
                  >
                    {fact.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isMinimal) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 p-2 md:gap-6">
        {packageData.rating != null && (
          <div className="flex items-center gap-1">
            <StarIcon className="h-4 w-4 text-amber-500" aria-hidden />
            <span className={`font-body text-sm font-medium ${textPrimary}`}>
              {packageData.rating.toFixed(1)}
            </span>
          </div>
        )}
        {facts.map((fact) => (
          <div key={fact.label} className="flex items-center gap-2">
            <fact.icon className={`h-4 w-4 shrink-0 ${iconTone}`} aria-hidden />
            <span className={`font-body text-sm ${textPrimary}`}>{fact.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 md:gap-4 ${outerClass}`}>
      {ratingBlock}
      {facts.map((fact) => (
        <div key={fact.label} className="flex items-center gap-2">
          <fact.icon className={`h-4 w-4 shrink-0 ${iconTone}`} aria-hidden />
          <div className="leading-tight">
            <p className={`font-body text-sm font-medium ${textPrimary}`}>{fact.value}</p>
            <p className={`font-body text-xs ${textMuted}`}>{fact.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
