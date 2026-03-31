import React, { useState } from 'react';
import { ChevronDownIcon, CalendarDaysIcon, UsersIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';
import type { Package } from '../../../../types';

const TRUNCATE_LENGTH = 400;

interface AboutSectionProps {
  packageData: Package;
}

export function AboutSection({ packageData }: AboutSectionProps) {
  const theme = usePackageDetailVariant();
  const [expanded, setExpanded] = useState(false);

  const desc = packageData.description || '';
  const detailed = packageData.detailed_description || '';
  const hasMore = desc.length > TRUNCATE_LENGTH || Boolean(detailed);
  const showShortDesc = hasMore && !expanded && desc.length > TRUNCATE_LENGTH;
  const displayDesc = showShortDesc ? `${desc.slice(0, TRUNCATE_LENGTH)}…` : desc;

  const highlightsRaw = packageData.highlights
    ? Array.isArray(packageData.highlights)
      ? packageData.highlights
      : String(packageData.highlights).split(',')
    : [];
  const highlights = highlightsRaw
    .map((h) => String(h).trim())
    .filter(Boolean)
    .slice(0, 10);

  const destCount = packageData.destinations?.length ?? 0;
  const groupMin = packageData.group_size?.min ?? 1;
  const groupMax = packageData.group_size?.max ?? 4;

  const statItems = [
    {
      label: 'Duration',
      value: `${packageData.duration} days`,
      icon: CalendarDaysIcon,
    },
    {
      label: 'Travelers',
      value: `${groupMin}–${groupMax} guests`,
      icon: UsersIcon,
    },
    ...(destCount > 0
      ? [
          {
            label: 'Stops',
            value: `${destCount} destination${destCount !== 1 ? 's' : ''}`,
            icon: MapPinIcon,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {(packageData.category || packageData.difficulty_level) && (
        <div className="flex flex-wrap gap-2">
          {packageData.category && (
            <span className="rounded-full bg-editorial-espresso px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider text-white">
              {packageData.category}
            </span>
          )}
          {packageData.difficulty_level && (
            <span className="rounded-full border border-editorial-espresso/20 bg-editorial-linen/80 px-3 py-1 font-body text-xs font-semibold capitalize text-editorial-espresso">
              {packageData.difficulty_level}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {statItems.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-editorial-espresso/10 bg-editorial-sand/40 px-3 py-3 sm:px-4"
          >
            <div className="flex items-center gap-2 text-editorial-espresso/50">
              <Icon className="h-4 w-4 shrink-0 text-editorial-forest" aria-hidden />
              <span className="font-body text-[0.65rem] font-semibold uppercase tracking-widest">{label}</span>
            </div>
            <p
              className="mt-1.5 font-display text-lg font-semibold text-editorial-espresso sm:text-xl"
              style={{ fontFamily: theme.fonts.heading }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="relative">
        <div
          className="absolute -left-1 top-0 hidden h-full w-1 rounded-full bg-editorial-terracotta/70 sm:block"
          aria-hidden
        />
        <p
          className="font-body text-lg leading-relaxed text-editorial-espresso sm:pl-5 sm:text-xl sm:leading-relaxed"
          style={{ fontFamily: theme.fonts.body }}
        >
          {displayDesc}
        </p>
      </div>

      {expanded && detailed && (
        <div className="rounded-2xl border border-editorial-espresso/10 bg-editorial-linen/50 p-5 sm:p-6">
          <p
            className="font-body text-base leading-relaxed text-editorial-espresso/85 whitespace-pre-line"
            style={{ fontFamily: theme.fonts.body }}
          >
            {detailed}
          </p>
        </div>
      )}

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-editorial-espresso/15 bg-white px-4 py-2 font-body text-sm font-semibold text-editorial-espresso transition hover:border-editorial-terracotta/40 hover:bg-editorial-sand/30"
        >
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
            aria-hidden
          />
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}

      {highlights.length > 0 && (
        <div className="rounded-2xl border border-dashed border-editorial-espresso/15 bg-gradient-to-br from-editorial-mist/40 to-editorial-sand/30 p-5 sm:p-6">
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.2em] text-editorial-espresso/45">
            Highlights
          </p>
          <ul className="flex flex-wrap gap-2">
            {highlights.map((h, i) => (
              <li
                key={i}
                className="rounded-full bg-white/90 px-3 py-1.5 font-body text-sm text-editorial-espresso shadow-sm ring-1 ring-editorial-espresso/10"
              >
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
