import React, {memo, useCallback, useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Select, SelectTheme} from '@src/shared/ui/Select/Select';
import countryStore from '../model/store/countryStore';

interface CountrySelectProps {
  country: string;
  changeCountry: (country: string) => void;
  initialValue?: string;
}

const CountrySelect = (props: CountrySelectProps) => {
  const {changeCountry, country, initialValue} = props;
  const {t} = useTranslation();

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
        Theme={SelectTheme.OUTLINE}
        prompt={'Country'}
        initialValue={initialValue}
        label={t('profile.country') || ''}
        options={countryStore.countrySelectOptions}
        value={country}
        isScrolling
        onSelect={onChangeHandler}
      />
    </SafeAreaView>
  );
};

export default memo(observer(CountrySelect));
