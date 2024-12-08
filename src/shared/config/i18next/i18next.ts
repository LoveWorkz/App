import i18n, {Module} from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {USER_LANGUAGE_STORAGE_KEY} from '../../consts/storage';
import {lngStorage} from '../../lib/storage/adapters/lngAdapter';
import {locals} from './locals';

const LANG_CODES = Object.keys(locals);
const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: (callback: Function) => {
    lngStorage.getLanguage(USER_LANGUAGE_STORAGE_KEY, (err, language) => {
      if (err || !language) {
        if (err) {
          console.log('Error fetching Languages from asyncstorage ', err);
        } else {
          console.info('No language is set, choosing English as fallback');
        }
        // const deviceLanguageInfo = RNLocalize.getLocales()?.[0];

        // if (!deviceLanguageInfo) {
        //   callback('en');

        //   return;
        // }

        // if (LANG_CODES.includes(deviceLanguageInfo.languageCode)) {
        //   // set default language from device
        //   callback(deviceLanguageInfo.languageCode);
        // } else {
        //   // default language
        //   callback('en');
        // }

        callback('en');

        return;
      }

      callback(language);
    });
  },
  init: () => {},
  cacheUserLanguage: (language: LanguageValueType) => {
    lngStorage.setLanguage(USER_LANGUAGE_STORAGE_KEY, language);
  },
};

i18n
  .use(LANGUAGE_DETECTOR as Module)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3', // for android
    resources: locals,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
