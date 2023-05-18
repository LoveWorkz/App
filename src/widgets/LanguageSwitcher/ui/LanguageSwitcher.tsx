import React, {memo, useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';

import {Select, SelectTheme} from '@src/shared/ui/Select/Select';
import {globalStyles} from '@src/app/styles/GlobalStyle';
import {LanguageValueType} from '../model/types/language';

const getLanguages = (
  t: TFunction,
): {label: string; value: LanguageValueType}[] => {
  return [
    {
      label: t('settings.english'),
      value: 'en',
    },
    {
      label: t('settings.portuguese'),
      value: 'pt',
    },
    {
      label: t('settings.german'),
      value: 'de',
    },
  ];
};

const LanguageSwitcher = () => {
  const {t, i18n} = useTranslation();
  const languages = getLanguages(t);

  const onLanguageChangeHandler = useCallback(
    (value: string) => {
      i18n.changeLanguage(value);
    },
    [i18n],
  );

  const mode = useMemo(() => {
    return {...globalStyles.size_5};
  }, []);

  return (
    <View>
      <Select
        selectedValueStyle={mode}
        Theme={SelectTheme.CLEAR}
        prompt={t('settings.language') || ''}
        label={t('settings.language') || ''}
        initialValue={i18n.language}
        options={languages}
        value={i18n.language}
        onSelect={onLanguageChangeHandler}
      />
    </View>
  );
};

export default memo(LanguageSwitcher);
