import React, {memo, useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';
import RNRestart from 'react-native-restart';

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
      label: t('settings.german'),
      value: 'de',
    },
    {
      label: t('settings.portuguese'),
      value: 'pt',
    },
  ];
};

interface LanguageSwitcherProps {
  isLanguagePopupVisible: boolean;
  setIsLanguagePopupVisible: (isVisible: boolean) => void;
}

const LanguageSwitcher = (props: LanguageSwitcherProps) => {
  const {isLanguagePopupVisible, setIsLanguagePopupVisible} = props;

  const {t, i18n} = useTranslation();
  const languages = getLanguages(t);

  const onLanguageChangeHandler = useCallback(
    (value: string) => {
      // console.log('NEW: ', value);
      // console.log('CURRENT: ', i18n.language);
      if (i18n.language !== value) {
        i18n.changeLanguage(value);
        RNRestart.restart();
      }
    },
    [i18n],
  );

  const mode = useMemo(() => {
    return {...globalStyles.size_5};
  }, []);

  return (
    <View>
      <Select
        setIsPopupVisible={setIsLanguagePopupVisible}
        isPopupVisible={isLanguagePopupVisible}
        selectedValueStyle={mode}
        Theme={SelectTheme.CLEAR}
        prompt={t('settings.language') || ''}
        label={t('settings.language') || ''}
        initialValue={i18n.language}
        options={languages}
        value={i18n.language}
        closingTime={220}
        onClose={() => {}}
        onSelect={onLanguageChangeHandler}
      />
    </View>
  );
};

export default memo(LanguageSwitcher);
