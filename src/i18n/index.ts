import { I18n } from 'i18n-js';
import { translations } from './translations';
import type { Language } from '../types';

const i18n = new I18n(translations);

i18n.locale = 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export const setLanguage = (lang: Language) => {
  i18n.locale = lang;
};

export const getCurrentLanguage = (): Language => {
  return i18n.locale as Language;
};

export const getDeviceLanguage = (): Language => {
  try {
    const Localization = require('expo-localization');
    const locale = Localization.getLocales()[0]?.languageCode || 'en';
    return locale.startsWith('de') ? 'de' : 'en';
  } catch (error) {
    return 'en';
  }
};

export const t = (key: string, params?: Record<string, string>) => {
  return i18n.t(key, params);
};

export default i18n;
