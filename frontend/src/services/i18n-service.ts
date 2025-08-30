import { apiPublicGet, apiPublicPost, apiGet, apiPost, apiPut, apiUpload } from '../api';

export interface Language {
  id: number;
  code: string;
  name: string;
  native_name: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  is_active: boolean;
  is_default: boolean;
}

export interface Translation {
  id: number;
  key: string;
  value: string;
  language_code: string;
  is_approved: boolean;
}

export interface CulturalContent {
  id: number;
  content_type: string;
  title: string;
  content: string;
  language_code: string;
  order: number;
}

export interface RegionalSettings {
  currency_code: string;
  currency_symbol: string;
  date_format: string;
  time_format: '12' | '24';
  timezone: string;
  phone_format: string;
}

export interface TranslationStats {
  language_code: string;
  total_keys: number;
  translated_keys: number;
  approved_keys: number;
  pending_keys: number;
  completion_percentage: number;
  last_updated: string;
}

class I18nService {
  private currentLanguage: string = 'en';
  private translations: Record<string, any> = {};
  private culturalContent: CulturalContent[] = [];
  private regionalSettings: RegionalSettings | null = null;
  private supportedLanguages: Language[] = [];

  constructor() {
    this.initializeLanguage();
  }

  private async initializeLanguage() {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage) {
      this.currentLanguage = savedLanguage;
    } else {
      // Try to detect language from browser
      const browserLanguage = navigator.language.split('-')[0];
      this.currentLanguage = this.isLanguageSupported(browserLanguage) ? browserLanguage : 'en';
    }

    await this.loadLanguageData();
  }

  private isLanguageSupported(code: string): boolean {
    return ['en', 'ru', 'zh'].includes(code);
  }

  async loadLanguageData() {
    try {
      // Load supported languages
      await this.loadSupportedLanguages();
      
      // Load translations
      await this.loadTranslations();
      
      // Load cultural content
      await this.loadCulturalContent();
      
      // Load regional settings
      await this.loadRegionalSettings();
    } catch (error) {
      console.error('Error loading language data:', error);
    }
  }

  async loadSupportedLanguages() {
    try {
      const data = await apiPublicGet('/languages/');
      this.supportedLanguages = data;
    } catch (error) {
      console.error('Error loading supported languages:', error);
    }
  }

  async loadTranslations() {
    try {
      const data = await apiPublicGet(`/translations/?lang=${this.currentLanguage}`);
      this.translations = data;
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  async loadCulturalContent() {
    try {
      const data = await apiPublicGet(`/cultural-content/?lang=${this.currentLanguage}`);
      this.culturalContent = data;
    } catch (error) {
      console.error('Error loading cultural content:', error);
    }
  }

  async loadRegionalSettings() {
    try {
      const data = await apiPublicGet(`/regional-settings/${this.currentLanguage}/`);
      this.regionalSettings = data;
    } catch (error) {
      console.error('Error loading regional settings:', error);
    }
  }

  async setLanguage(languageCode: string) {
    if (!this.isLanguageSupported(languageCode)) {
      throw new Error(`Language ${languageCode} is not supported`);
    }

    this.currentLanguage = languageCode;
    localStorage.setItem('preferred-language', languageCode);
    
    // Reload language data
    await this.loadLanguageData();
    
    // Update document direction
    const language = this.supportedLanguages.find(lang => lang.code === languageCode);
    if (language) {
      document.documentElement.dir = language.direction;
      document.documentElement.lang = languageCode;
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  getSupportedLanguages(): Language[] {
    return this.supportedLanguages;
  }

  t(key: string, params?: Record<string, any>): string {
    const keys = key.split('.');
    let value = this.translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to key if translation not found
        return key;
      }
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
    // Replace parameters if provided
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] || match;
      });
    }
    
    return value;
  }

  getCulturalContent(type?: string): CulturalContent[] {
    if (type) {
      return this.culturalContent.filter(content => content.content_type === type);
    }
    return this.culturalContent;
  }

  getRegionalSettings(): RegionalSettings | null {
    return this.regionalSettings;
  }

  formatCurrency(amount: number, currency?: string): string {
    const settings = this.regionalSettings;
    if (!settings) return `${amount}`;
    
    const currencyCode = currency || settings.currency_code;
    const symbol = settings.currency_symbol;
    
    return `${symbol}${amount.toLocaleString()}`;
  }

  formatDate(date: Date | string, format?: string): string {
    const settings = this.regionalSettings;
    if (!settings) return new Date(date).toLocaleDateString();
    
    const dateObj = new Date(date);
    const formatStr = format || settings.date_format;
    
    // Simple date formatting - you might want to use a library like date-fns
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return formatStr
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day);
  }

  formatTime(date: Date | string, format?: string): string {
    const settings = this.regionalSettings;
    if (!settings) return new Date(date).toLocaleTimeString();
    
    const dateObj = new Date(date);
    const timeFormat = format || settings.time_format;
    
    if (timeFormat === '24') {
      return dateObj.toLocaleTimeString('en-GB', { hour12: false });
    } else {
      return dateObj.toLocaleTimeString('en-US', { hour12: true });
    }
  }

  async detectLanguage(text: string): Promise<string> {
    try {
      const data = await apiPublicPost('/detect-language/', { text });
      return data.detected_language;
    } catch (error) {
      console.error('Error detecting language:', error);
      return 'en';
    }
  }

  async getTranslationStats(languageCode?: string): Promise<TranslationStats> {
    try {
      const lang = languageCode || this.currentLanguage;
      const data = await apiPublicGet(`/translations/stats/?lang=${lang}`);
      return data;
    } catch (error) {
      console.error('Error getting translation stats:', error);
      return {
        language_code: languageCode || this.currentLanguage,
        total_keys: 0,
        translated_keys: 0,
        approved_keys: 0,
        pending_keys: 0,
        completion_percentage: 0,
        last_updated: new Date().toISOString()
      };
    }
  }

  async exportTranslations(languageCode: string, format: 'json' | 'csv' | 'xlsx' = 'json') {
    try {
      const data = await apiPublicGet(`/translations/export/?language_code=${languageCode}&format=${format}`);
      return data;
    } catch (error) {
      console.error('Error exporting translations:', error);
      throw error;
    }
  }

  async importTranslations(languageCode: string, file: File, overwrite: boolean = false) {
    try {
      const formData = new FormData();
      formData.append('language_code', languageCode);
      formData.append('file', file);
      formData.append('overwrite', String(overwrite));

      const data = await apiUpload('/translations/import/', formData);
      return data;
    } catch (error) {
      console.error('Error importing translations:', error);
      throw error;
    }
  }

  async createTranslation(key: string, value: string, languageCode?: string) {
    try {
      const lang = languageCode || this.currentLanguage;
      const data = await apiPost('/translations/create/', {
        key,
        value,
        language: lang
      });
      return data;
    } catch (error) {
      console.error('Error creating translation:', error);
      throw error;
    }
  }

  async updateTranslation(translationId: number, value: string) {
    try {
      const data = await apiPut(`/translations/${translationId}/update/`, {
        value
      });
      return data;
    } catch (error) {
      console.error('Error updating translation:', error);
      throw error;
    }
  }

  async bulkUpdateTranslations(languageCode: string, translations: Record<string, string>) {
    try {
      const data = await apiPost('/translations/bulk/', {
        language_code: languageCode,
        translations
      });
      return data;
    } catch (error) {
      console.error('Error bulk updating translations:', error);
      throw error;
    }
  }

  // Utility methods for common translations
  getCommonTranslations() {
    return {
      bookNow: this.t('common.book_now'),
      viewDetails: this.t('common.view_details'),
      loading: this.t('common.loading'),
      error: this.t('common.error'),
      success: this.t('common.success'),
      home: this.t('navigation.home'),
      packages: this.t('navigation.packages'),
      transportation: this.t('navigation.transportation'),
      contact: this.t('navigation.contact'),
      about: this.t('navigation.about')
    };
  }

  // Method to get all translations for a specific context
  getContextTranslations(context: string): Record<string, string> {
    const contextTranslations: Record<string, string> = {};
    
    Object.keys(this.translations).forEach(key => {
      if (key.startsWith(context + '.')) {
        const subKey = key.substring(context.length + 1);
        contextTranslations[subKey] = this.t(key);
      }
    });
    
    return contextTranslations;
  }

  // Method to check if a translation exists
  hasTranslation(key: string): boolean {
    const keys = key.split('.');
    let value = this.translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return false;
      }
    }
    
    return typeof value === 'string';
  }

  // Method to get missing translations
  getMissingTranslations(requiredKeys: string[]): string[] {
    return requiredKeys.filter(key => !this.hasTranslation(key));
  }
}

// Create singleton instance
export const i18nService = new I18nService();

// Export for use in components
export default i18nService;
