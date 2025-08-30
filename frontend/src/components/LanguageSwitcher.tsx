import React, { useState, useEffect } from 'react';
import { 
  GlobeAltIcon, 
  ChevronDownIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { i18nService, Language } from '../services/i18n-service';
import { languageUtils, languages as i18nLanguages } from '../i18n';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'buttons' | 'flags';
  showLabels?: boolean;
  onLanguageChange?: (languageCode: string) => void;
}

export function LanguageSwitcher({ 
  className = '', 
  variant = 'dropdown',
  showLabels = true,
  onLanguageChange 
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [supportedLanguages, setSupportedLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadLanguages();
  }, []);

  const loadLanguages = async () => {
    try {
      const languages = i18nService.getSupportedLanguages();
      // Fallback to hardcoded languages if API fails
      if (languages.length === 0) {
        const fallbackLanguages = Object.entries(i18nLanguages).map(([code, info], idx) => ({
          id: idx + 1,
          code,
          name: info.name,
          native_name: info.nativeName,
          flag: info.flag,
          direction: info.direction,
          is_active: true,
          is_default: code === 'en',
        })) as unknown as Language[];
        setSupportedLanguages(fallbackLanguages);
      } else {
        setSupportedLanguages(languages);
      }
      setCurrentLanguage(localStorage.getItem('preferred-language') || i18nService.getCurrentLanguage());
    } catch (error) {
      console.error('Error loading languages:', error);
      // Fallback to hardcoded languages on error
      const fallbackLanguages = Object.entries(i18nLanguages).map(([code, info], idx) => ({
        id: idx + 1,
        code,
        name: info.name,
        native_name: info.nativeName,
        flag: info.flag,
        direction: info.direction,
        is_active: true,
        is_default: code === 'en',
      })) as unknown as Language[];
      setSupportedLanguages(fallbackLanguages);
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === currentLanguage) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      // Update react-i18next first (immediate UI change with static locales)
      languageUtils.setLanguage(languageCode as any);
      // Also try to use the backend-powered i18n service (best effort)
      try { await i18nService.setLanguage(languageCode); } catch {}
      setCurrentLanguage(languageCode);
      setIsOpen(false);
      onLanguageChange?.(languageCode);
    } catch (error) {
      console.error('Error changing language via i18n service:', error);
      // Fallback: just update local state and localStorage
      setCurrentLanguage(languageCode);
      localStorage.setItem('preferred-language', languageCode);
      setIsOpen(false);
      onLanguageChange?.(languageCode);
      
      // Optional: show a notification that translation might not be available
      console.log(`Language changed to ${languageCode}. Some translations may not be available.`);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLanguageInfo = () => {
    return supportedLanguages.find(lang => lang.code === currentLanguage) || {
      code: 'en',
      name: 'English',
      native_name: 'English',
      flag: '🇺🇸'
    };
  };

  const currentLang = getCurrentLanguageInfo();

  // Button variant
  if (variant === 'buttons') {
    return (
      <div className={`flex space-x-2 ${className}`}>
        {supportedLanguages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
              currentLanguage === language.code
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-lg">{language.flag}</span>
            {showLabels && (
              <span className="text-sm font-medium">
                {language.native_name}
              </span>
            )}
            {currentLanguage === language.code && (
              <CheckIcon className="w-4 h-4" />
            )}
          </button>
        ))}
      </div>
    );
  }

  // Flags variant
  if (variant === 'flags') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {supportedLanguages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            disabled={isLoading}
            className={`text-2xl transition-all hover:scale-110 ${
              currentLanguage === language.code
                ? 'ring-2 ring-blue-500 ring-offset-2 rounded'
                : 'opacity-70 hover:opacity-100'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={`${language.name} (${language.native_name})`}
          >
            {language.flag}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant (default)
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all ${
          isOpen ? 'ring-2 ring-blue-500 ring-offset-2' : ''
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <GlobeAltIcon className="w-5 h-5 text-gray-600" />
        <span className="text-lg">{currentLang.flag}</span>
        {showLabels && (
          <span className="text-sm font-medium text-gray-700">
            {currentLang.native_name}
          </span>
        )}
        <ChevronDownIcon className={`w-4 h-4 text-gray-600 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {supportedLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                disabled={isLoading}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                  currentLanguage === language.code
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="text-lg">{language.flag}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {language.native_name}
                  </div>
                  {language.native_name !== language.name && (
                    <div className="text-xs text-gray-500">
                      {language.name}
                    </div>
                  )}
                </div>
                {currentLanguage === language.code && (
                  <CheckIcon className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default LanguageSwitcher; 