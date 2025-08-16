import React, { useState } from 'react';
import { GlobeAltIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../i18n';
import { languages, languageUtils, type LanguageCode } from '../i18n';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'buttons';
}

export function LanguageSwitcher({ className = '', variant = 'dropdown' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const currentLanguage = i18n.language as LanguageCode;

  const handleLanguageChange = (lang: LanguageCode) => {
    languageUtils.setLanguage(lang);
    setIsOpen(false);
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {Object.entries(languages).map(([code, lang]) => (
          <button
            key={code}
            onClick={() => handleLanguageChange(code as LanguageCode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentLanguage === code
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
        <span className="text-lg">{languages[currentLanguage]?.flag}</span>
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
          {languages[currentLanguage]?.nativeName}
        </span>
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
              {Object.entries(languages).map(([code, lang]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code as LanguageCode)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                    currentLanguage === code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                  aria-label={`Switch to ${lang.name}`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="text-xs text-gray-500">{lang.name}</span>
                  </div>
                  {currentLanguage === code && (
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

export default LanguageSwitcher; 