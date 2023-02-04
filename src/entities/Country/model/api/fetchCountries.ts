import axios from 'axios';
import {Country} from '../types/countryTypes';

export const fetchCountries = async () => {
  const result = await axios.get<Country[]>(
    'https://restcountries.com/v3.1/all',
  );
  return result.data;
};
