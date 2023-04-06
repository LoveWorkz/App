import React, {memo, useCallback, useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {observer} from 'mobx-react-lite';

import {Select} from '@src/shared/ui/Select/Select';
import {SelectTheme} from '@src/shared/ui/Select/TouchableComponent';
import {useColors} from '@src/app/providers/colorsProvider';
import countryStore from '../model/store/countryStore';

interface CountrySelectProps {
  country: string;
  changeCountry: (country: string) => void;
  initialValue?: string;
}

const CountrySelect = (props: CountrySelectProps) => {
  const {changeCountry, country, initialValue} = props;
  const colors = useColors();

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
      <Select
        selectedValueStyle={{color: colors.primaryTextColor}}
        Theme={SelectTheme.OUTLINE}
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
