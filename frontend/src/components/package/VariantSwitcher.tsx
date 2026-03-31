import React from 'react';
import { ChevronDownIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import {
  packageDetailVariants,
  type PackageDetailVariant,
} from '../../theme/packageDetailVariants';
import { setStoredLayoutVariant } from './packageLayoutVariantStorage';

interface VariantSwitcherProps {
  value: PackageDetailVariant;
  onChange: (variant: PackageDetailVariant) => void;
}

export function VariantSwitcher({ value, onChange }: VariantSwitcherProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as PackageDetailVariant;
    onChange(v);
    setStoredLayoutVariant(v);
  };

  const selectId = 'package-detail-layout-variant';

  return (
    <div
      className="pointer-events-auto flex items-stretch gap-0 overflow-hidden rounded-2xl border-2 border-editorial-espresso/25 bg-white shadow-lg shadow-editorial-espresso/15 ring-2 ring-white/80 backdrop-blur-md"
      style={{ minHeight: '48px' }}
    >
      <span
        className="hidden items-center border-r border-editorial-espresso/15 bg-editorial-sand/60 px-3 sm:flex"
        aria-hidden
      >
        <Squares2X2Icon className="h-5 w-5 text-editorial-forest" />
      </span>
      <div className="relative min-w-0 flex-1">
        <label htmlFor={selectId} className="sr-only">
          Package page layout style
        </label>
        <select
          id={selectId}
          value={value}
          onChange={handleChange}
          className="h-full min-h-12 w-full min-w-[200px] cursor-pointer appearance-none rounded-none border-0 bg-transparent py-2 pl-3 pr-11 font-body text-sm font-semibold text-editorial-espresso outline-none transition hover:bg-editorial-linen/40 focus-visible:bg-editorial-linen/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-editorial-forest/35 sm:min-w-[220px] sm:pl-4"
        >
          {(Object.keys(packageDetailVariants) as PackageDetailVariant[]).map((id) => (
            <option key={id} value={id}>
              {packageDetailVariants[id].name}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-editorial-espresso/60"
          aria-hidden
        />
      </div>
    </div>
  );
}
