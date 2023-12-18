import React, {memo, useCallback} from 'react';
import {SafeAreaView} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Select, SelectTheme} from '@src/shared/ui/Select/Select';

interface DateOfBirthProps {
  country: string;
  changeCountry: (country: string) => void;
  initialValue?: string;
  isLoading: boolean;
}

const DateOfBirth = (props: DateOfBirthProps) => {
  const {changeCountry, isLoading} = props;
  const {t} = useTranslation();

  const onChangeHandler = useCallback(
    (value: string) => {
      changeCountry?.(value);
    },
    [changeCountry],
  );

  return (
    <SafeAreaView>
      <Select
        isLoading={isLoading}
        Theme={SelectTheme.OUTLINE}
        prompt={'Country'}
        initialValue={''}
        label={t('profile.date_of_birth') || ''}
        options={[]}
        value={''}
        onSelect={onChangeHandler}
      />
    </SafeAreaView>
  );
};

export default memo(observer(DateOfBirth));
