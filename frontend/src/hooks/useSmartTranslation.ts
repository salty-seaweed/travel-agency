import { useTranslation } from '../i18n';

/**
 * Smart translation hook that only translates UI elements
 * and leaves dynamic content (like property names, descriptions) in original language
 */
export function useSmartTranslation() {
  const { t, i18n } = useTranslation();

  const smartT = (key: string, fallback?: string) => {
    // Only translate UI elements (buttons, labels, navigation, messages)
    if (key.startsWith('ui.')) {
      return t(key, { defaultValue: fallback || key });
    }
    
    // For dynamic content, return the fallback or key
    return fallback || key;
  };

  const translateUI = (key: string) => {
    return t(`ui.${key}`);
  };

  const translateButton = (key: string) => {
    return t(`ui.buttons.${key}`);
  };

  const translateLabel = (key: string) => {
    return t(`ui.labels.${key}`);
  };

  const translateNav = (key: string) => {
    return t(`ui.navigation.${key}`);
  };

  const translateMessage = (key: string) => {
    return t(`ui.messages.${key}`);
  };

  return {
    t: smartT,
    translateUI,
    translateButton,
    translateLabel,
    translateNav,
    translateMessage,
    i18n,
    currentLanguage: i18n.language
  };
} 