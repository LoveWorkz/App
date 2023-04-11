import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {useColors} from '@src/app/providers/colorsProvider';
import {Radio} from '@src/shared/ui/Radio/Radio';
import {LanguageType} from '../model/types/types';

const data = [LanguageType.ENGLISH, LanguageType.PORTUGUESE];

const LanguageSwitcher = () => {
  const colors = useColors();

  const [language, setLanguage] = useState(LanguageType.ENGLISH);

  const onLanguageChangeHandler = useCallback((value: string) => {
    setLanguage(value as LanguageType);
  }, []);

  return (
    <View>
      <Radio
        roundStyle={{borderColor: colors.primaryTextColor}}
        nameStyle={{color: colors.primaryTextColor}}
        style={[styles.language, {color: colors.primaryTextColor}]}
        value={language}
        data={data}
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

export const Wrapper = memo(LanguageSwitcher);
