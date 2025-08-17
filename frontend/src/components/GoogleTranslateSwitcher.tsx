import React, { useState } from 'react';
import { GlobeAltIcon, ChevronDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useGoogleTranslate } from '../hooks/useGoogleTranslate';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

interface GoogleTranslateSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'buttons';
}

export function GoogleTranslateSwitcher({ 
  className = '', 
  variant = 'dropdown' 
}: GoogleTranslateSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, isTranslationActive, resetTranslation } = useGoogleTranslate();

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    if (langCode === 'en') {
      resetTranslation();
    } else {
      // Trigger Google Translate to change language
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
      }
    }
    setIsOpen(false);
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {languages.slice(0, 4).map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentLanguage === lang.code
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            aria-label={`Switch to ${lang.name}`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="hidden sm:inline">{lang.nativeName}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <GlobeAltIcon className="h-4 w-4 text-gray-600" />
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
          {currentLang.nativeName}
        </span>
        {isTranslationActive && (
          <ArrowPathIcon className="h-4 w-4 text-blue-500 animate-spin" />
        )}
        <ChevronDownIcon className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-20 min-w-[200px]">
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                    currentLanguage === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                  aria-label={`Switch to ${lang.name}`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="text-xs text-gray-500">{lang.name}</span>
                  </div>
                  {currentLanguage === lang.code && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default GoogleTranslateSwitcher; 