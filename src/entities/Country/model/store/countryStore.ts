import {makeAutoObservable} from 'mobx';

import {fetchCountries} from '../api/fetchCountries';
import {CountrySelectOptions} from '../types/countryTypes';

class CountryStore {
  countrySelectOptions: CountrySelectOptions[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  fetchCountries = async () => {
    try {
      const countries = await fetchCountries();
      const countriesNames = countries
        .map(country => country.name.common)
        .sort()
        .map(countryName => ({
          label: countryName,
          value: countryName,
        }));
      this.setCountries(countriesNames);
    } catch (e) {
      console.log(e);
    }
  };

  setCountries(countriesNames: CountrySelectOptions[]) {
    this.countrySelectOptions = countriesNames;
  }
}

export default new CountryStore();
