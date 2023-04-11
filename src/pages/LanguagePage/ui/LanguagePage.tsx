import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {LanguageSwitcher} from '@src/widgets/LanguageSwitcher';

export const LanguagePage = () => {
  return (
    <View style={styles.LanguagePage}>
      <LanguageSwitcher />
    </View>
  );
};

export const Wrapper = memo(LanguagePage);

const styles = StyleSheet.create({
  LanguagePage: {
    flex: 1,
  },
});
