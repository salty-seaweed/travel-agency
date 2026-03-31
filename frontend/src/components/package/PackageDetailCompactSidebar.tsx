import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/outline';
import { useCurrency } from '../../contexts/CurrencyContext';
import type { Package } from '../../types';
import type { BookingInitialValues } from './packageDetailLayoutTypes';

interface PackageDetailCompactSidebarProps {
  packageData: Package;
  onBookNow: (init?: BookingInitialValues) => void;
  selectedVariant?: { id: number; duration_days: number; price: string; is_default?: boolean };
  variants?: Array<{ id: number; duration_days: number; price: string; is_default?: boolean }>;
  selectedVariantId?: number | null;
  onVariantChange?: (id: number) => void;
  variant?: 'floating' | 'bottom';
}

function getMinDate() {
  return new Date().toISOString().split('T')[0];
}

function getMaxDate() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0];
}

function pricingTypeLabel(pkg: Package): string {
  switch (pkg.pricing_type) {
    case 'per_couple':
      return 'per couple';
    case 'per_room':
      return 'per room';
    case 'per_group':
      return 'per group';
    default:
      return 'per person';
  }
}

export function PackageDetailCompactSidebar({
  packageData,
  onBookNow,
  selectedVariant,
  variants = [],
  selectedVariantId,
  onVariantChange,
  variant = 'floating',
}: PackageDetailCompactSidebarProps) {
  const { formatPrice } = useCurrency();
  const isFloating = variant === 'floating';

  const durationDays = selectedVariant?.duration_days ?? packageData.duration ?? 1;
  const groupMin = packageData.group_size?.min ?? 1;
  const groupMax = packageData.group_size?.max ?? 8;
  const travelerOptions = Array.from({ length: groupMax - groupMin + 1 }, (_, i) => groupMin + i);

  const [departureDate, setDepartureDate] = useState('');
  const [travelers, setTravelers] = useState(groupMin);

  const currentPrice = selectedVariant
    ? parseFloat(String(selectedVariant.price))
    : parseFloat(
        typeof packageData.price === 'string'
          ? packageData.price.replace(/[^0-9.]/g, '')
          : String(packageData.price)
      );

  const pricingText = pricingTypeLabel(packageData);

  const handleReserve = () => {
    onBookNow({
      start_date: departureDate || undefined,
      number_of_guests: travelers,
    });
  };

  const sortedVariants = [...variants].sort((a, b) => a.duration_days - b.duration_days);

  const panel = (
    <div className="flex flex-col gap-4 rounded-2xl border border-editorial-espresso/10 bg-white/90 p-5 shadow-editorial backdrop-blur-sm">
      {sortedVariants.length > 0 && onVariantChange && (
        <div className="flex flex-wrap gap-2">
          {sortedVariants.map((v) => {
            const active = selectedVariantId === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onVariantChange(v.id)}
                className={`min-h-9 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-editorial-espresso text-white shadow-md ring-2 ring-editorial-forest/25'
                    : 'border border-editorial-espresso/20 bg-white text-editorial-espresso hover:border-editorial-terracotta/40'
                }`}
              >
                {v.duration_days}d
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-semibold text-editorial-terracotta md:text-3xl">
            {formatPrice(currentPrice)}
          </p>
          <p className="font-body text-sm text-editorial-espresso/55">{pricingText}</p>
          <p className="mt-0.5 font-body text-xs text-editorial-espresso/45">
            {durationDays} day{durationDays !== 1 ? 's' : ''} itinerary
          </p>
        </div>
        {packageData.rating != null &&
          packageData.review_count != null &&
          packageData.review_count > 0 && (
            <div className="flex items-center gap-1 font-body text-sm text-editorial-espresso/70">
              <StarIcon className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
              <span className="font-medium">{packageData.rating.toFixed(1)}</span>
              <span aria-hidden>·</span>
              <span>{packageData.review_count} reviews</span>
            </div>
          )}
      </div>

      <div className="rounded-xl border border-editorial-espresso/15 bg-editorial-linen/40 p-3">
        <div className="flex flex-col gap-3">
          <div>
            <label
              htmlFor="pkg-compact-departure"
              className="mb-1 block font-body text-xs font-semibold uppercase tracking-wide text-editorial-espresso/55"
            >
              Departure
            </label>
            <input
              id="pkg-compact-departure"
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              min={getMinDate()}
              max={getMaxDate()}
              className="min-h-11 w-full rounded-lg border border-editorial-espresso/20 bg-white px-3 py-2 font-body text-sm text-editorial-espresso outline-none transition focus:border-editorial-forest focus:ring-2 focus:ring-editorial-forest/20"
            />
          </div>
          <div>
            <label
              htmlFor="pkg-compact-travelers"
              className="mb-1 block font-body text-xs font-semibold uppercase tracking-wide text-editorial-espresso/55"
            >
              Travelers
            </label>
            <select
              id="pkg-compact-travelers"
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="min-h-11 w-full rounded-lg border border-editorial-espresso/20 bg-white px-3 py-2 font-body text-sm text-editorial-espresso outline-none transition focus:border-editorial-forest focus:ring-2 focus:ring-editorial-forest/20"
            >
              {travelerOptions.map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'traveler' : 'travelers'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleReserve}
        className="min-h-12 w-full rounded-xl bg-editorial-espresso py-3 font-body text-sm font-semibold text-white shadow-md transition hover:bg-editorial-forest hover:shadow-editorial-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-editorial-forest"
      >
        Reserve
      </button>

      <p className="text-center font-body text-xs text-editorial-espresso/50">You won&apos;t be charged yet</p>
    </div>
  );

  if (isFloating) {
    return <div className="sticky top-24 self-start">{panel}</div>;
  }

  return panel;
}
