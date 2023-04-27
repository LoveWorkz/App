import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';

import {useColors} from '@src/app/providers/colorsProvider';
import {Radio} from '@src/shared/ui/Radio/Radio';
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
  const colors = useColors();
  const {t, i18n} = useTranslation();

  const onLanguageChangeHandler = useCallback(
    (value: string) => {
      i18n.changeLanguage(value);
    },
    [i18n],
  );

  return (
    <View>
      <Radio
        roundStyle={{borderColor: colors.primaryTextColor}}
        nameStyle={{color: colors.primaryTextColor}}
        style={[styles.language, {color: colors.primaryTextColor}]}
        value={i18n.language}
        data={getLanguages(t)}
        onChange={onLanguageChangeHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  language: {
    marginBottom: 24,
  },
});

export default memo(LanguageSwitcher);
