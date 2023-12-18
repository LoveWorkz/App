import React, {memo, useCallback} from 'react';
import {SafeAreaView} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Select, SelectTheme} from '@src/shared/ui/Select/Select';
import {getGenderList} from '../model/lib/genderLib';

interface GenderProps {
  gender: string;
  changeGender: (gender: string) => void;
  initialValue?: string;
  isLoading: boolean;
  error?: string | null;
}

const Gender = (props: GenderProps) => {
  const {changeGender, gender, initialValue, isLoading, error} = props;
  const {t} = useTranslation();

  const onChangeHandler = useCallback(
    (value: string) => {
      changeGender?.(value);
    },
    [changeGender],
  );

  return (
    <SafeAreaView>
      <Select
        isLoading={isLoading}
        Theme={SelectTheme.OUTLINE}
        prompt={'Gender'}
        initialValue={initialValue}
        label={t('profile.gender') || ''}
        options={getGenderList(t)}
        value={gender}
        onSelect={onChangeHandler}
        error={error}
      />
    </SafeAreaView>
  );
};

export default memo(observer(Gender));
