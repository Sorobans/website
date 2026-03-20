import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      heroTitle: 'Soroban Blog Template',
      heroSubtitle:
        'Astro shell, React 19 islands, StyleX atoms, zero-backend search.',
      actionPrimary: 'Start writing',
      actionSecondary: 'View components',
      searchTitle: 'Search posts',
      searchPlaceholder: 'Search posts...',
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      results: 'Results',
    },
  },
};

/**
 * Ensures i18next is initialized and set to English.
 * Forced to 'en' to override any browser or system-level language detection.
 */
export function ensureI18n() {
  const targetLang = 'en';

  if (!i18n.isInitialized) {
    void i18n.use(initReactI18next).init({
      resources,
      lng: targetLang,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
  } else if (i18n.language !== targetLang) {
    void i18n.changeLanguage(targetLang);
  }

  return i18n;
}
