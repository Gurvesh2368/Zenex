import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import hi from './hi.json';
import mr from './mr.json';

const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('yojana_lang') || 'en' : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React handles XSS safely
  },
});

export const changeLanguage = (lng: 'en' | 'hi' | 'mr') => {
  i18n.changeLanguage(lng);
  if (typeof window !== 'undefined') {
    localStorage.setItem('yojana_lang', lng);
    document.documentElement.lang = lng;
  }
};

export default i18n;
