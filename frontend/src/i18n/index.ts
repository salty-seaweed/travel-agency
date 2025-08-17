// Internationalization System - Russian and Chinese Support
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language resources
import en from './locales/en.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';

// Language configuration
export const languages = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr'
  },
  ru: {
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    direction: 'ltr'
  },
  zh: {
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    direction: 'ltr'
  }
} as const;

export type LanguageCode = keyof typeof languages;

// Default language detection
const getDefaultLanguage = (): LanguageCode => {
  const savedLang = localStorage.getItem('preferred-language') as LanguageCode;
  if (savedLang && languages[savedLang]) {
    return savedLang;
  }

  const browserLang = navigator.language.split('-')[0] as LanguageCode;
  if (browserLang && languages[browserLang]) {
    return browserLang;
  }

  return 'en';
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      zh: { translation: zh }
    },
    lng: getDefaultLanguage(),
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Pluralization rules
    pluralSeparator: '_',
    
    // Key separator
    keySeparator: '.',
    
    // Namespace separator
    nsSeparator: ':',
    
    // React options
    react: {
      useSuspense: false,
    },
  });

// Language management utilities
export const languageUtils = {
  // Get current language
  getCurrentLanguage: (): LanguageCode => {
    return i18n.language as LanguageCode;
  },

  // Set language
  setLanguage: (lang: LanguageCode): void => {
    if (languages[lang]) {
      i18n.changeLanguage(lang);
      localStorage.setItem('preferred-language', lang);
      
      // Update document direction
      document.documentElement.dir = languages[lang].direction;
      document.documentElement.lang = lang;
    }
  },

  // Get available languages
  getAvailableLanguages: () => languages,

  // Format currency based on locale
  formatCurrency: (amount: number, currency: string = 'USD'): string => {
    const lang = i18n.language;
    const formatter = new Intl.NumberFormat(lang, {
      style: 'currency',
      currency,
    });
    return formatter.format(amount);
  },

  // Format date based on locale
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const lang = i18n.language;
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const formatter = new Intl.DateTimeFormat(lang, options);
    return formatter.format(dateObj);
  },

  // Format number based on locale
  formatNumber: (number: number, options?: Intl.NumberFormatOptions): string => {
    const lang = i18n.language;
    const formatter = new Intl.NumberFormat(lang, options);
    return formatter.format(number);
  },

  // Get text direction
  getTextDirection: (): 'ltr' | 'rtl' => {
    const lang = i18n.language as LanguageCode;
    return languages[lang]?.direction || 'ltr';
  },

  // Check if language is RTL
  isRTL: (): boolean => {
    return languageUtils.getTextDirection() === 'rtl';
  }
};

// Export i18n instance
export default i18n;

// Export translation hook for convenience
export { useTranslation } from 'react-i18next'; 