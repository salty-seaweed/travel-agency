import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  StarIcon,
  HeartIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { LazyImage } from '../LazyImage';
import { useWhatsApp } from '../../hooks/useQueries';
import type { Package } from '../../types';
import { parsePackagePriceValue } from './utils/packageMoney';
import { useCurrency } from '../../contexts/CurrencyContext';

interface PackageHeroProps {
  packageData: Package;
  onBookNow: () => void;
  onAddToWishlist: () => void;
  onShare: () => void;
  isWishlisted: boolean;
}

function difficultyPillClass(level: Package['difficulty_level']): string {
  switch (level) {
    case 'easy':
      return 'bg-emerald-500/25 text-emerald-100 ring-1 ring-emerald-400/40';
    case 'moderate':
      return 'bg-amber-500/25 text-amber-100 ring-1 ring-amber-400/40';
    case 'challenging':
      return 'bg-orange-500/25 text-orange-100 ring-1 ring-orange-400/40';
    case 'expert':
      return 'bg-red-500/25 text-red-100 ring-1 ring-red-400/40';
    default:
      return 'bg-white/15 text-white ring-1 ring-white/25';
  }
}

const stagger = 0.08;

export function PackageHero({
  packageData: pkg,
  onBookNow,
  onAddToWishlist,
  onShare,
  isWishlisted,
}: PackageHeroProps) {
  const navigate = useNavigate();
  const { getWhatsAppUrl } = useWhatsApp();
  const { formatPrice } = useCurrency();

  const price = parsePackagePriceValue(pkg.price);
  const priceLabel = Number.isFinite(price) ? formatPrice(price) : pkg.price;
  const pricingBasis =
    pkg.pricing_type === 'per_couple'
      ? 'per couple'
      : pkg.pricing_type === 'per_room'
        ? 'per room'
        : pkg.pricing_type === 'per_group'
          ? 'per group'
          : 'per person';

  const handleWhatsApp = () => {
    const message = `Hi! I'd like to know more about "${pkg.name}".`;
    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <section className="relative flex min-h-[72vh] items-end overflow-hidden text-white">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {pkg.images && pkg.images.length > 0 ? (
          <LazyImage
            src={pkg.images[0].image}
            alt={pkg.name}
            className="h-full w-full bg-editorial-espresso object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-editorial-forest via-editorial-forestLight to-editorial-espresso" />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-editorial-espresso via-editorial-espresso/55 to-editorial-espresso/25"
          aria-hidden
        />
      </motion.div>

      <div className="relative w-full">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <motion.div
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            <button
              type="button"
              onClick={() => navigate('/packages')}
              className="inline-flex min-h-0 items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-white/95 ring-1 ring-white/20 backdrop-blur-md transition hover:bg-white/20"
            >
              <ArrowLeftIcon className="h-5 w-5" aria-hidden />
              Back to packages
            </button>
            <nav
              className="text-sm text-white/75"
              aria-label="Breadcrumb"
            >
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <button type="button" onClick={() => navigate('/')} className="hover:text-white">
                    Home
                  </button>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/packages')}
                    className="hover:text-white"
                  >
                    Packages
                  </button>
                </li>
                <li aria-hidden>/</li>
                <li className="font-semibold text-white">{pkg.name}</li>
              </ol>
            </nav>
          </motion.div>

          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <motion.div
                className="mb-4 flex flex-wrap items-center gap-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + stagger }}
              >
                {pkg.category && (
                  <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ring-1 ring-white/25 backdrop-blur-md">
                    {pkg.category}
                  </span>
                )}
                <span
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize ${difficultyPillClass(pkg.difficulty_level)}`}
                >
                  {pkg.difficulty_level}
                </span>
                {pkg.is_featured && (
                  <span className="rounded-full bg-editorial-terracotta/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg ring-1 ring-white/20">
                    Featured
                  </span>
                )}
              </motion.div>

              <motion.h1
                className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white drop-shadow-md md:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.28 + stagger }}
              >
                {pkg.name}
              </motion.h1>

              <motion.div
                className="mt-4 flex flex-wrap items-center gap-6 text-base text-white/90"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.36 + stagger }}
              >
                {pkg.destinations?.[0]?.location && (
                  <span className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5 shrink-0 text-editorial-mist" aria-hidden />
                    {pkg.destinations[0].location.island}, {pkg.destinations[0].location.atoll}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <StarSolidIcon className="h-5 w-5 shrink-0 text-amber-400" aria-hidden />
                  {pkg.rating?.toFixed(1) ?? '—'} ({pkg.review_count ?? 0} reviews)
                </span>
              </motion.div>

              <motion.p
                className="mt-5 max-w-3xl text-lg leading-relaxed text-white/88"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.44 + stagger }}
              >
                {pkg.description}
              </motion.p>

              <motion.div
                className="mt-6 flex flex-wrap gap-8 text-base text-white/90"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.52 + stagger }}
              >
                <span className="flex items-center gap-2">
                  <CalendarIcon className="h-6 w-6 text-editorial-mist" aria-hidden />
                  {pkg.duration} days
                </span>
                <span className="flex items-center gap-2">
                  <UsersIcon className="h-6 w-6 text-editorial-mist" aria-hidden />
                  {pkg.group_size?.min}-{pkg.group_size?.max} people
                </span>
                <span className="flex items-center gap-2">
                  <MapPinIcon className="h-6 w-6 text-editorial-mist" aria-hidden />
                  {pkg.destinations?.length ?? 0} islands
                </span>
              </motion.div>
            </div>

            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.4 }}
            >
              <div className="rounded-2xl border border-white/20 bg-black/35 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium uppercase tracking-widest text-white/60">
                    From
                  </span>
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <StarIcon className="h-4 w-4 text-amber-400" aria-hidden />
                    <span>
                      {pkg.rating?.toFixed(1) ?? '—'} · {pkg.review_count ?? 0} reviews
                    </span>
                  </div>
                </div>
                <p className="mt-2 font-display text-4xl font-semibold text-white">{priceLabel}</p>
                <p className="mt-1 text-sm text-white/70">{pricingBasis}</p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:flex-col">
                  <button
                    type="button"
                    onClick={onBookNow}
                    className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-editorial-terracotta px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-editorial-terracottaDark hover:shadow-editorial-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Book now
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-white/12 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/20"
                  >
                    WhatsApp
                  </button>
                  <div className="flex flex-1 gap-2">
                    <button
                      type="button"
                      onClick={onAddToWishlist}
                      className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-white/10 px-3 py-3 ring-1 ring-white/25 transition hover:bg-white/18"
                      aria-pressed={isWishlisted}
                      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      {isWishlisted ? (
                        <HeartSolidIcon className="h-6 w-6 text-editorial-terracotta" />
                      ) : (
                        <HeartIcon className="h-6 w-6 text-white" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={onShare}
                      className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-white/10 px-3 py-3 ring-1 ring-white/25 transition hover:bg-white/18"
                      aria-label="Share package"
                    >
                      <ShareIcon className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
