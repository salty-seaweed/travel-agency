import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  StarIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  TruckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { useWhatsApp } from '../../hooks/useQueries';
import { useCurrency } from '../../contexts/CurrencyContext';
import type { Package, PackageVariant } from '../../types';
import { discountPercent, parsePackagePriceValue } from './utils/packageMoney';

export interface PackageSidebarProps {
  packageData: Package;
  onBookNow: () => void;
  selectedVariant?: PackageVariant | null;
  variants?: PackageVariant[];
  selectedVariantId?: number | null;
  onVariantChange?: (id: number) => void;
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

function durationSummaryText(
  pkg: Package,
  selected: PackageVariant | null | undefined
): string {
  const label = pricingTypeLabel(pkg);
  if (selected) {
    return `${label} · ${selected.duration_days} days`;
  }
  const list = pkg.variants ?? [];
  if (list.length === 0) {
    return `${label} · ${pkg.duration} days`;
  }
  const durations = Array.from(
    new Set(list.map((v) => Number(v.duration_days)).filter((n) => Number.isFinite(n)))
  ).sort((a, b) => a - b);
  if (durations.length === 0) {
    return `${label} · ${pkg.duration} days`;
  }
  const range =
    durations.length > 1
      ? `${durations[0]}–${durations[durations.length - 1]}`
      : String(durations[0]);
  return `${label} · ${range} days`;
}

function finitePrice(n: number): number | null {
  return Number.isFinite(n) ? n : null;
}

export function PackageSidebar({
  packageData,
  onBookNow,
  selectedVariant,
  variants = [],
  selectedVariantId,
  onVariantChange,
}: PackageSidebarProps) {
  const { getWhatsAppUrl } = useWhatsApp();
  const { formatPrice } = useCurrency();

  const handleWhatsApp = () => {
    const message = `Hi! I'd like to book the "${packageData.name}" package.`;
    const whatsappUrl = getWhatsAppUrl(message);
    window.open(whatsappUrl, '_blank');
  };

  const currentPrice = finitePrice(
    selectedVariant
      ? parsePackagePriceValue(selectedVariant.price)
      : parsePackagePriceValue(packageData.price)
  );
  const originalPriceRaw = selectedVariant?.original_price
    ? parsePackagePriceValue(selectedVariant.original_price)
    : packageData.original_price &&
        packageData.original_price !== '0' &&
        packageData.original_price !== null
      ? parsePackagePriceValue(packageData.original_price)
      : Number.NaN;
  const originalPrice = finitePrice(originalPriceRaw);

  const showStrikethrough =
    originalPrice !== null && currentPrice !== null && originalPrice !== currentPrice;

  const savePct =
    currentPrice !== null && originalPrice !== null
      ? discountPercent(currentPrice, originalPrice)
      : null;

  const sortedVariants = [...variants].sort((a, b) => a.duration_days - b.duration_days);

  const payNowHref = () => {
    const amount =
      currentPrice ??
      parsePackagePriceValue(packageData.price);
    const description = `${packageData.name} - Package Booking`;
    return `/payment/checkout?amount=${amount}&description=${encodeURIComponent(description)}&currency=USD`;
  };

  return (
    <div className="sticky top-4 z-[1]">
      <div className="overflow-hidden rounded-2xl border border-editorial-espresso/10 bg-white/85 shadow-editorial backdrop-blur-md">
        {sortedVariants.length > 0 && onVariantChange && (
          <div className="border-b border-editorial-espresso/10 bg-editorial-sand/40 px-5 py-4">
            <p className="font-display text-sm font-semibold tracking-wide text-editorial-espresso">
              Choose duration
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sortedVariants.map((v) => {
                const active = selectedVariantId === v.id;
                const p = parsePackagePriceValue(v.price);
                const label = Number.isFinite(p) ? formatPrice(p) : v.price;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => onVariantChange(v.id)}
                    className={`min-h-0 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                      active
                        ? 'bg-editorial-forest text-white shadow-md ring-2 ring-editorial-forest/30'
                        : 'bg-white/90 text-editorial-espresso ring-1 ring-editorial-espresso/15 hover:bg-editorial-linen hover:ring-editorial-terracotta/40'
                    }`}
                  >
                    {v.duration_days} days · {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="px-5 py-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-editorial-espresso/50">
            Starting from
          </p>
          <div className="mt-2 flex flex-wrap items-baseline justify-center gap-2">
            {showStrikethrough && originalPrice !== null && (
              <span className="font-body text-lg text-neutral-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="font-display text-4xl font-semibold text-editorial-terracotta md:text-[2.75rem]">
              {currentPrice !== null ? formatPrice(currentPrice) : '—'}
            </span>
          </div>
          <p className="mt-2 font-body text-sm text-editorial-espresso/70">
            {durationSummaryText(packageData, selectedVariant ?? null)}
          </p>
          {savePct !== null && savePct > 0 && (
            <span className="mt-3 inline-block rounded-full bg-editorial-terracotta/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-editorial-terracottaDark">
              Save {savePct}%
            </span>
          )}
        </div>

        <div className="border-t border-editorial-espresso/10 px-5 py-5">
          <h3 className="font-display text-lg font-semibold text-editorial-espresso">Details</h3>
          <ul className="mt-4 space-y-3 font-body text-sm">
            <li className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-editorial-espresso/65">
                <CalendarIcon className="h-4 w-4 shrink-0 text-editorial-forest" aria-hidden />
                Duration
              </span>
              <span className="font-medium text-editorial-espresso">
                {selectedVariant ? selectedVariant.duration_days : packageData.duration} days
              </span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-editorial-espresso/65">
                <UsersIcon className="h-4 w-4 shrink-0 text-editorial-forest" aria-hidden />
                Group size
              </span>
              <span className="font-medium text-editorial-espresso">
                {packageData.group_size?.min ?? 1}–{packageData.group_size?.max ?? 4} people
              </span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-editorial-espresso/65">
                <StarIcon className="h-4 w-4 shrink-0 text-editorial-forest" aria-hidden />
                Difficulty
              </span>
              <span className="font-medium capitalize text-editorial-espresso">
                {packageData.difficulty_level ?? 'easy'}
              </span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-editorial-espresso/65">
                <MapPinIcon className="h-4 w-4 shrink-0 text-editorial-forest" aria-hidden />
                Category
              </span>
              <span className="font-medium capitalize text-editorial-espresso">
                {packageData.category || 'Adventure'}
              </span>
            </li>
          </ul>
        </div>

        {(packageData.accommodation_type || packageData.room_type || packageData.meal_plan) && (
          <div className="border-t border-editorial-espresso/10 px-5 py-5">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-editorial-espresso">
              <HomeIcon className="h-5 w-5 text-editorial-forest" aria-hidden />
              Accommodation
            </h3>
            <ul className="mt-3 space-y-2 font-body text-sm">
              {packageData.accommodation_type && (
                <li className="flex justify-between gap-3">
                  <span className="text-editorial-espresso/65">Type</span>
                  <span className="font-medium text-editorial-espresso">{packageData.accommodation_type}</span>
                </li>
              )}
              {packageData.room_type && (
                <li className="flex justify-between gap-3">
                  <span className="text-editorial-espresso/65">Room</span>
                  <span className="font-medium text-editorial-espresso">{packageData.room_type}</span>
                </li>
              )}
              {packageData.meal_plan && (
                <li className="flex justify-between gap-3">
                  <span className="text-editorial-espresso/65">Meals</span>
                  <span className="font-medium text-editorial-espresso">{packageData.meal_plan}</span>
                </li>
              )}
            </ul>
          </div>
        )}

        {(packageData.transportation_details || packageData.airport_transfers) && (
          <div className="border-t border-editorial-espresso/10 px-5 py-5">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-editorial-espresso">
              <TruckIcon className="h-5 w-5 text-editorial-forest" aria-hidden />
              Transportation
            </h3>
            {packageData.transportation_details && (
              <div className="mt-3 space-y-2">
                {packageData.transportation_details.split('\n\n').map((section, index) => {
                  if (!section.trim()) return null;
                  const lines = section.split('\n');
                  const title = lines[0] ?? '';
                  const content = lines.slice(1).join(' ');
                  return (
                    <div
                      key={`transport-${index}`}
                      className="rounded-xl bg-editorial-sand/50 px-3 py-2.5"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-editorial-forest">
                        {title.replace(':', '')}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-editorial-espresso/80">{content}</p>
                    </div>
                  );
                })}
              </div>
            )}
            {packageData.airport_transfers && (
              <p className="mt-3 flex items-center gap-2 text-sm text-editorial-espresso/75">
                <CheckCircleIcon className="h-4 w-4 shrink-0 text-editorial-forest" aria-hidden />
                Airport transfers included
              </p>
            )}
          </div>
        )}

        <div className="border-t border-editorial-espresso/10 px-5 py-5">
          <h3 className="font-display text-lg font-semibold text-editorial-espresso">Good to know</h3>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-editorial-espresso/55">
                What to bring
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-editorial-espresso/75">
                {(packageData.what_to_bring && packageData.what_to_bring.length > 0
                  ? packageData.what_to_bring.slice(0, 4)
                  : [
                      'Comfortable walking shoes',
                      'Sun protection (hat, sunscreen)',
                      'Camera for memories',
                      ...(packageData.category?.toLowerCase().includes('water')
                        ? ['Swimwear and towel']
                        : []),
                    ]
                ).map((item, index) => (
                  <li key={index} className="flex gap-2">
                    <CheckCircleIcon
                      className="mt-0.5 h-4 w-4 shrink-0 text-editorial-forest"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-editorial-espresso/55">
                Important notes
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-editorial-espresso/75">
                {(packageData.important_notes && packageData.important_notes.length > 0
                  ? packageData.important_notes.slice(0, 3)
                  : [
                      'Weather conditions may affect activities',
                      'Advance booking recommended',
                      'Contact us for special requirements',
                    ]
                ).map((note, index) => (
                  <li key={index} className="flex gap-2">
                    <ExclamationTriangleIcon
                      className="mt-0.5 h-4 w-4 shrink-0 text-editorial-terracotta"
                      aria-hidden
                    />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
            {(packageData.best_time_to_visit || packageData.weather_info) && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-editorial-espresso/55">
                  Best time to visit
                </p>
                <p className="mt-2 text-sm text-editorial-espresso/75">
                  {packageData.best_time_to_visit ||
                    packageData.weather_info ||
                    'Year-round destination with tropical climate'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-editorial-espresso/10 bg-editorial-sand/30 px-5 py-5">
          <h3 className="font-display text-lg font-semibold text-editorial-espresso">Ready to book?</h3>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href={payNowHref()}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-editorial-espresso px-4 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:bg-editorial-forest hover:shadow-editorial-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-editorial-forest"
            >
              <CreditCardIcon className="h-5 w-5 shrink-0" aria-hidden />
              Pay now with BML
            </a>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-editorial-espresso/20 bg-white/90 px-4 py-3 text-sm font-semibold text-editorial-espresso transition hover:border-editorial-terracotta/50 hover:bg-editorial-linen focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-editorial-forest"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 shrink-0" aria-hidden />
              Book via WhatsApp
            </button>
            <button
              type="button"
              onClick={onBookNow}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-editorial-espresso/15 bg-transparent px-4 py-3 text-sm font-semibold text-editorial-espresso transition hover:border-editorial-forest/40 hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-editorial-forest"
            >
              <EnvelopeIcon className="h-5 w-5 shrink-0" aria-hidden />
              Fill booking form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
