import React, {memo} from 'react';
import {StyleSheet, Switch} from 'react-native';

import {Theme, useTheme} from '@src/app/providers/themeProvider';
import {isPlatformIos} from '@src/shared/consts/common';

const ThemeSwitcher = () => {
  const {theme, toggleTheme} = useTheme();
  const isLightMode = theme === Theme.Dark;

  return (
    <Switch
      style={styles.switcher}
      trackColor={{false: '#B4BCF4', true: '#847AED'}}
      thumbColor={'white'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={toggleTheme}
      value={isLightMode}
      disabled
    />
  );
};

const styles = StyleSheet.create({
  switcher: {
    transform: [
      {scaleX: isPlatformIos ? 0.8 : 1.2},
      {scaleY: isPlatformIos ? 0.8 : 1.2},
    ],
  },
});

export const Wrapper = memo(ThemeSwitcher);
