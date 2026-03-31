import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useCurrency } from '../contexts/CurrencyContext';
import { cn } from '../styles/design-system';

export interface CurrencySelectorProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
  showLabel?: boolean;
  /** Tighter control for the main nav bar */
  compact?: boolean;
}

export function CurrencySelector({
  size = 'md',
  variant = 'outline',
  showLabel = true,
  compact = false,
}: CurrencySelectorProps) {
  const { selectedCurrency, currencies, changeCurrency } = useCurrency();

  const buttonClass = cn(
    'inline-flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-1',
    compact
      ? 'min-h-9 gap-1.5 rounded-lg border border-slate-200/90 bg-white px-3 py-2 text-sm font-semibold tabular-nums text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50'
      : cn(
          'font-medium',
          'gap-2 rounded-lg border shadow-sm',
          size === 'sm' && 'h-9 px-2.5 py-1.5 text-sm',
          size === 'md' && 'h-10 px-3 py-2 text-sm',
          size === 'lg' && 'h-11 px-4 py-2 text-base',
          variant === 'outline' && 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50',
          variant === 'ghost' && 'border-transparent bg-transparent text-gray-800 hover:bg-gray-100',
          variant === 'solid' && 'border-transparent bg-sky-600 text-white hover:bg-sky-700',
        ),
  );

  const iconClass = compact ? 'h-4 w-4 shrink-0 text-slate-500' : 'h-4 w-4 shrink-0 text-gray-500';
  const chevronClass = compact ? 'h-4 w-4 shrink-0 text-slate-400' : 'h-4 w-4 shrink-0 text-gray-400';

  return (
    <Menu>
      <MenuButton className={buttonClass} aria-label={`Currency: ${selectedCurrency.code}`}>
        {!compact && <CurrencyDollarIcon className={iconClass} aria-hidden />}
        <span className="tabular-nums">
          {selectedCurrency.symbol} {selectedCurrency.code}
        </span>
        {showLabel && !compact && size !== 'sm' && (
          <span className="hidden text-gray-500 sm:inline">({selectedCurrency.name})</span>
        )}
        <ChevronDownIcon className={chevronClass} aria-hidden />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        modal={false}
        className={cn(
          'z-[100] mt-1 max-h-[min(18rem,70vh)] w-56 origin-top-right overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg outline-none transition duration-100 ease-out [--anchor-gap:4px] data-[closed]:scale-95 data-[closed]:opacity-0',
        )}
      >
        {currencies.map((currency) => {
          const selected = selectedCurrency.code === currency.code;
          return (
            <MenuItem key={currency.code}>
              {({ focus }) => (
                <button
                  type="button"
                  onClick={() => changeCurrency(currency.code)}
                  className={cn(
                    'flex w-full items-start gap-3 px-3 py-2 text-left text-sm',
                    focus && 'bg-gray-50',
                    selected && 'bg-sky-50',
                  )}
                >
                  <span className="min-w-[2rem] font-medium tabular-nums">{currency.symbol}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-gray-900">{currency.code}</span>
                    <span className="block text-xs text-gray-500">{currency.name}</span>
                  </span>
                  {selected ? <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-500" /> : null}
                </button>
              )}
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
}
