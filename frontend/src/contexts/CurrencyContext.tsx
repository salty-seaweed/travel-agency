import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Exchange rate relative to USD
  locale: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1, locale: 'en-US' },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85, locale: 'de-DE' },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73, locale: 'en-GB' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110, locale: 'ja-JP' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35, locale: 'en-AU' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25, locale: 'en-CA' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.92, locale: 'de-CH' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 6.45, locale: 'zh-CN' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 74.5, locale: 'en-IN' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.35, locale: 'en-SG' },
];

interface CurrencyContextType {
  selectedCurrency: Currency;
  currencies: Currency[];
  changeCurrency: (currencyCode: string) => void;
  formatPrice: (price: number, options?: { showSymbol?: boolean; precision?: number }) => string;
  convertPrice: (price: number, fromCurrency?: string) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[0]);

  // Load saved currency preference from localStorage
  useEffect(() => {
    const savedCurrencyCode = localStorage.getItem('selectedCurrency');
    if (savedCurrencyCode) {
      const currency = SUPPORTED_CURRENCIES.find(c => c.code === savedCurrencyCode);
      if (currency) {
        setSelectedCurrency(currency);
      }
    }
  }, []);

  const changeCurrency = (currencyCode: string) => {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
    if (currency) {
      setSelectedCurrency(currency);
      localStorage.setItem('selectedCurrency', currencyCode);
    }
  };

  const convertPrice = (price: number, fromCurrency: string = 'USD'): number => {
    // Convert from source currency to USD first, then to target currency
    const fromRate = SUPPORTED_CURRENCIES.find(c => c.code === fromCurrency)?.rate || 1;
    const usdPrice = price / fromRate;
    return usdPrice * selectedCurrency.rate;
  };

  const formatPrice = (
    price: number, 
    options: { showSymbol?: boolean; precision?: number } = {}
  ): string => {
    const { showSymbol = true, precision } = options;
    const convertedPrice = convertPrice(price);

    const formatter = new Intl.NumberFormat(selectedCurrency.locale, {
      style: showSymbol ? 'currency' : 'decimal',
      currency: selectedCurrency.code,
      minimumFractionDigits: precision !== undefined ? precision : (convertedPrice >= 100 ? 0 : 2),
      maximumFractionDigits: precision !== undefined ? precision : (convertedPrice >= 100 ? 0 : 2),
    });

    return formatter.format(convertedPrice);
  };

  const value: CurrencyContextType = {
    selectedCurrency,
    currencies: SUPPORTED_CURRENCIES,
    changeCurrency,
    formatPrice,
    convertPrice,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
