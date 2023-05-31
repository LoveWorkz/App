import {makeAutoObservable} from 'mobx';
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import de from 'i18n-iso-countries/langs/de.json';
import pt from 'i18n-iso-countries/langs/pt.json';
import crashlytics from '@react-native-firebase/crashlytics';

import {SelectOption} from '@src/shared/types/types';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';

countries.registerLocale(en);
countries.registerLocale(de);
countries.registerLocale(pt);

class CountryStore {
  countrySelectOptions: SelectOption[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  fetchCountries = async (language: LanguageValueType) => {
    try {
      crashlytics().log('Fetching countries.');

      const data = countries.getNames(language, {select: 'official'});

      const formattedCountries = Object.keys(data).map(key => {
        return {
          label: data[key],
          value: key,
        };
      });

      this.setCountries(formattedCountries);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setCountries(countriesNames: SelectOption[]) {
    this.countrySelectOptions = countriesNames;
  }
}

export default new CountryStore();
