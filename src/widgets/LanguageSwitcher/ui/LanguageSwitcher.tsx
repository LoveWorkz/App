import React, {memo, useCallback, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import {
  CustomSelect,
  SelectTheme,
} from '@src/shared/ui/CustomSelect/CustomSelect';

const options = [
  {
    value: 'English',
    label: 'English',
  },
  {
    value: 'Portuguese',
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
      <CustomSelect
        Theme={SelectTheme.CLEAR}
        options={options}
        value={selectedLanguage}
        onSelect={onSelecteLanguageHandler}
        selectedValueStyle={styles.itemStyle}
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
