import React, {memo, useCallback, useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {observer} from 'mobx-react-lite';

import countryStore from '../model/store/countryStore';
import {
  CustomSelect,
  SelectTheme,
} from '@src/shared/ui/CustomSelect/CustomSelect';

interface CountrySelectProps {
  country: string;
  changeCountry: (country: string) => void;
  initialValue?: string;
}

const CountrySelect = (props: CountrySelectProps) => {
  const {changeCountry, country, initialValue} = props;

  useEffect(() => {
    countryStore.fetchCountries();
  }, []);

  const onChangeHandler = useCallback(
    (value: string) => {
      changeCountry?.(value);
    },
    [changeCountry],
  );

  return (
    <SafeAreaView>
      <CustomSelect
        Theme={SelectTheme.UNDERLINE}
        prompt={'Country'}
        initialValue={initialValue}
        label={'Country'}
        options={countryStore.countrySelectOptions}
        value={country}
        onSelect={onChangeHandler}
      />
    </SafeAreaView>
  );
};

export const Wrapper = memo(observer(CountrySelect));
