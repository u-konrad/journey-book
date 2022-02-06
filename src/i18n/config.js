import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  fallbackLng: 'pl',
  lng: 'pl',
  resources: {
    en: {
      translations: require('./locales/en/translations.json')
    },
    pl: {
      translations: require('./locales/pl/translations.json')
    }
  },
  ns: ['translations'],
  defaultNS: 'translations'
});

i18n.languages = ['en', 'pl'];

export default i18n;
