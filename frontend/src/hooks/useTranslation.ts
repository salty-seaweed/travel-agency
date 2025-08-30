import { useState, useEffect, useCallback } from 'react';
import { i18nService } from '../services/i18n-service';

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState(i18nService.getCurrentLanguage());
  const [isLoading, setIsLoading] = useState(false);

  // Translation function
  const t = useCallback((key: string, params?: Record<string, any>): string => {
    return i18nService.t(key, params);
  }, []);

  // Language switching function
  const setLanguage = useCallback(async (languageCode: string) => {
    setIsLoading(true);
    try {
      await i18nService.setLanguage(languageCode);
      setCurrentLanguage(languageCode);
      
      // Trigger a page reload to update all components
      window.location.reload();
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get supported languages
  const getSupportedLanguages = useCallback(() => {
    return i18nService.getSupportedLanguages();
  }, []);

  // Get cultural content
  const getCulturalContent = useCallback((type?: string) => {
    return i18nService.getCulturalContent(type);
  }, []);

  // Get regional settings
  const getRegionalSettings = useCallback(() => {
    return i18nService.getRegionalSettings();
  }, []);

  // Format currency
  const formatCurrency = useCallback((amount: number, currency?: string) => {
    return i18nService.formatCurrency(amount, currency);
  }, []);

  // Format date
  const formatDate = useCallback((date: Date | string, format?: string) => {
    return i18nService.formatDate(date, format);
  }, []);

  // Format time
  const formatTime = useCallback((date: Date | string, format?: string) => {
    return i18nService.formatTime(date, format);
  }, []);

  // Check if translation exists
  const hasTranslation = useCallback((key: string) => {
    return i18nService.hasTranslation(key);
  }, []);

  // Get missing translations
  const getMissingTranslations = useCallback((requiredKeys: string[]) => {
    return i18nService.getMissingTranslations(requiredKeys);
  }, []);

  return {
    t,
    currentLanguage,
    setLanguage,
    isLoading,
    getSupportedLanguages,
    getCulturalContent,
    getRegionalSettings,
    formatCurrency,
    formatDate,
    formatTime,
    hasTranslation,
    getMissingTranslations
  };
}
