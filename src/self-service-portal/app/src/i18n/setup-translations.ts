import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { UiConfig } from '../ui-config/typings.ts';

export const setupI18nTranslations = (translations: UiConfig['messages']) => {
  /*
   * This app is supported in 'en', 'sv', 'pt', 'pt-PT' languages but is the backend that will detect
   * the user's language (based in the Accept Language header) and send the correct translations.
   * For now, we are setting 'en' as the app's language and pass whatever translations the backend sends.
   */
  const translationResources = {
    en: {
      translation: translations,
    },
  };

  i18n.use(initReactI18next).init({
    resources: translationResources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
    saveMissing: true,
  });
};
