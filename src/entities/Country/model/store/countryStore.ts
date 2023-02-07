import {makeAutoObservable} from 'mobx';

import {fetchCountries} from '../api/fetchCountries';
import {CountrySelectOptions} from '../types/countryTypes';

class CountryStore {
  countrySelectOptions: CountrySelectOptions[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  fetchCountries = async () => {
    const countries = await fetchCountries();
    const countriesNames = countries
      .map(country => country.name.common)
      .sort()
      .map(countryName => ({
        label: countryName,
        value: countryName,
      }));
    this.setCountries(countriesNames);
  };

  setCountries(countriesNames: CountrySelectOptions[]) {
    this.countrySelectOptions = countriesNames;
  }
}

export default new CountryStore();
