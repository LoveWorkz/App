import React, {memo} from 'react';
import {StyleSheet, Switch} from 'react-native';

import {Theme, useTheme} from '@src/app/providers/themeProvider';
import {isPlatformIos} from '@src/shared/consts/common';
import {themeStorage} from '@src/shared/lib/storage/adapters/themeAdapter';
import {THEME_STORAGE_KEY} from '@src/shared/consts/storage';

const ThemeSwitcher = () => {
  const {theme, toggleTheme} = useTheme();
  const isLightMode = theme === Theme.Dark;

  return (
    <>
      <Switch
        style={styles.switcher}
        trackColor={{false: '#B4BCF4', true: '#847AED'}}
        thumbColor={'white'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleTheme}
        value={isLightMode}
      />
      <Switch
        style={styles.switcher}
        trackColor={{false: 'red', true: 'blue'}}
        thumbColor={'white'}
        ios_backgroundColor="gree"
        onValueChange={() => themeStorage.removeTheme(THEME_STORAGE_KEY)}
        value={isLightMode}
      />
    </>
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
