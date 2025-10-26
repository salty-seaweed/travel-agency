import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useTranslation } from '../i18n';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface GoogleTranslateWidgetProps {
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

export const GoogleTranslateWidget = memo<GoogleTranslateWidgetProps>(({ 
  className = '', 
  position = 'bottom-right' 
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGoogleTranslateLoaded, setIsGoogleTranslateLoaded] = useState(false);
  const initializedRef = useRef(false);

  // Initialize Google Translate only once
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const loadGoogleTranslate = () => {
      if (isGoogleTranslateLoaded) return;

      const callbackName = 'googleTranslateElementInit';
      const timeoutId = setTimeout(() => {
        console.log('Google Translate API timeout, using fallback');
        delete (window as any)[callbackName];
        setIsGoogleTranslateLoaded(false);
      }, 5000);

      (window as any)[callbackName] = () => {
        clearTimeout(timeoutId);
        delete (window as any)[callbackName];
        setIsGoogleTranslateLoaded(true);
      };

      // Check if ad blockers are likely blocking the request
      const testRequest = new XMLHttpRequest();
      testRequest.open('GET', 'https://translate.googleapis.com/element/log?format=json&hasfast=true&authuser=0', false);
      testRequest.onerror = () => {
        console.log('Google Translate API blocked by ad blocker, using fallback');
        clearTimeout(timeoutId);
        delete (window as any)[callbackName];
        setIsGoogleTranslateLoaded(false);
      };
      
      try {
        testRequest.send();
        if (testRequest.status === 0 || testRequest.status >= 400) {
          // Request was blocked or failed
          console.log('Google Translate API blocked or failed, using fallback');
          clearTimeout(timeoutId);
          delete (window as any)[callbackName];
          setIsGoogleTranslateLoaded(false);
          return;
        }
      } catch (e) {
        // Request failed, likely blocked
        console.log('Google Translate API test failed, using fallback');
        clearTimeout(timeoutId);
        delete (window as any)[callbackName];
        setIsGoogleTranslateLoaded(false);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=' + callbackName;
      script.async = true;
      script.onerror = () => {
        console.log('Google Translate script failed to load, using fallback');
        clearTimeout(timeoutId);
        delete (window as any)[callbackName];
        setIsGoogleTranslateLoaded(false);
      };
      document.head.appendChild(script);
    };

    loadGoogleTranslate();

    return () => {
      // Cleanup
      if ((window as any).googleTranslateElementInit) {
        delete (window as any).googleTranslateElementInit;
      }
    };
  }, []);

  const translatePage = useCallback((langCode: string) => {
    if (langCode === 'en') {
      // Reset to English
      if (isGoogleTranslateLoaded && (window as any).google?.translate) {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (select) {
          select.value = 'en';
          select.dispatchEvent(new Event('change'));
        }
      }
      setCurrentLanguage('en');
      setIsExpanded(false);
      return;
    }

    setCurrentLanguage(langCode);
    setIsExpanded(false);
    setIsTranslating(true);

    // Use Google Translate API to translate the page
    if (isGoogleTranslateLoaded && (window as any).google?.translate) {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
      }
    } else {
      // Fallback: open Google Translate in new tab
      const translateUrl = `https://translate.google.com/translate?sl=en&tl=${langCode}&u=${encodeURIComponent(window.location.href)}`;
      window.open(translateUrl, '_blank');
    }

    setTimeout(() => {
      setIsTranslating(false);
    }, 2000);
  }, [isGoogleTranslateLoaded]);

  const getPositionStyles = useCallback(() => {
    switch (position) {
      case 'top-left':
        return { top: '20px', left: '20px' };
      case 'top-right':
        return { top: '20px', right: '20px' };
      case 'bottom-left':
        return { bottom: '20px', left: '20px' };
      default:
        return { bottom: '20px', right: '20px' };
    }
  }, [position]);

  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage) || supportedLanguages[0];

  return (
    <div 
      className={`google-translate-widget ${className}`}
      style={{
        position: 'fixed',
        ...getPositionStyles(),
        zIndex: 1000,
      }}
    >
      {/* Hidden Google Translate Element */}
      <div 
        id="google_translate_element" 
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          visibility: 'hidden' 
        }}
      />

      {/* Collapsed State - Floating Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          style={{
            width: '60px',
            height: '60px',
          }}
          aria-label="Open translation widget"
        >
          <div className="flex flex-col items-center justify-center">
            <div className="text-white text-xl mb-1">🌐</div>
            <span className="text-xs font-medium">{currentLang.flag}</span>
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                         {t('footer.translatePage', 'Translate Page')}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      )}

      {/* Expanded State - Full Widget */}
      {isExpanded && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden" style={{ width: '320px' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-white text-xl">🌐</div>
                <div>
                                     <h3 className="font-semibold text-lg">{t('footer.translatePageHeader', 'Translate Page')}</h3>
                   <p className="text-blue-100 text-sm">{t('footer.translatePageSubheader', 'Choose your language')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-blue-800 rounded-full transition-colors duration-200"
                aria-label="Close translation widget"
              >
                <div className="text-white text-lg">✕</div>
              </button>
            </div>
          </div>

          {/* Language Grid */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => translatePage(lang.code)}
                  disabled={isTranslating}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                    currentLanguage === lang.code
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium text-sm">{lang.name}</span>
                  {currentLanguage === lang.code && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                                  {isGoogleTranslateLoaded 
                    ? t('footer.poweredByGoogleTranslate', 'Powered by Google Translate') 
                    : t('footer.usingFallbackTranslation', 'Using fallback translation (Google Translate blocked)')
                  }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

GoogleTranslateWidget.displayName = 'GoogleTranslateWidget'; 