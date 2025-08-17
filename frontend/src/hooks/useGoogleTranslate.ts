import { useState, useEffect } from 'react';
import { googleTranslateService } from '../services/google-translate';

export function useGoogleTranslate() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslationActive, setIsTranslationActive] = useState(false);

  useEffect(() => {
    // Check translation status periodically
    const checkTranslationStatus = () => {
      const isActive = googleTranslateService.isTranslationActive();
      const language = googleTranslateService.getCurrentLanguage();
      
      setIsTranslationActive(isActive);
      setCurrentLanguage(language);
    };

    // Check immediately
    checkTranslationStatus();

    // Check every 2 seconds
    const interval = setInterval(checkTranslationStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  const resetTranslation = () => {
    googleTranslateService.resetTranslation();
    setCurrentLanguage('en');
    setIsTranslationActive(false);
  };

  const getTranslationStatus = () => {
    return {
      currentLanguage,
      isTranslationActive,
      isEnglish: currentLanguage === 'en'
    };
  };

  return {
    currentLanguage,
    isTranslationActive,
    resetTranslation,
    getTranslationStatus
  };
} 