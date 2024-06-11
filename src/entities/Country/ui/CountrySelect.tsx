import React, {memo, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

import {Select, SelectTheme} from '@src/shared/ui/Select/Select';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import countryStore from '../model/store/countryStore';

interface CountrySelectProps {
  country: string;
  changeCountry: (country: string) => void;
  initialValue?: string;
  isLoading: boolean;
  error?: string | null;
}

const CountrySelect = (props: CountrySelectProps) => {
  const {changeCountry, country, initialValue, isLoading, error} = props;
  const {t, i18n} = useTranslation();
  const language = i18n.language as LanguageValueType;

  useEffect(() => {
    countryStore.fetchCountries(language);
  }, [language]);

  const onChangeHandler = useCallback(
    (value: string) => {
      changeCountry?.(value);
    },
    [changeCountry],
  );

  return (
    <View>
      <Select
        isCountry
        isLoading={isLoading}
        Theme={SelectTheme.OUTLINE}
        prompt={'Country'}
        initialValue={initialValue}
        label={t('profile.country') || ''}
        options={countryStore.countrySelectOptions}
        value={country}
        isScrolling
        onSelect={onChangeHandler}
        error={error}
      />
    </View>
  );
};

export default memo(observer(CountrySelect));
