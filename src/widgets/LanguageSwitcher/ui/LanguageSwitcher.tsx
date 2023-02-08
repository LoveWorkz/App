import React, {memo, useCallback, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import {Select, SelectTheme} from '@src/shared/ui/Select/Select';

const options = [
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'por',
    label: 'Portuguese',
  },
];

const LanguageSwitcher = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const onSelecteLanguageHandler = useCallback((language: string) => {
    setSelectedLanguage(language);
  }, []);

  return (
    <SafeAreaView>
      <Select
        Theme={SelectTheme.CLEAR}
        options={options}
        value={selectedLanguage}
        onSelect={onSelecteLanguageHandler}
        itemStyles={styles.itemStyle}
        mode={'dropdown'}
        style={styles.select}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  select: {
    position: 'relative',
    left: -15,
    width: '108%',
  },
  itemStyle: {
    fontSize: 20,
  },
});

export const Wrapper = memo(LanguageSwitcher);
