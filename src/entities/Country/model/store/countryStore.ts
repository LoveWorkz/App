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
    const countriesNames = countries.map(country => ({
      label: country.name.common,
      value: country.name.common,
    }));
    this.setCountries(countriesNames);
  };

  setCountries(countriesNames: CountrySelectOptions[]) {
    this.countrySelectOptions = countriesNames;
  }
}

export default new CountryStore();
