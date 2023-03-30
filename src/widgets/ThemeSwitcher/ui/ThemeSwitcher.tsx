import React, {memo} from 'react';
import {StyleSheet, View, Switch, Platform} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Theme, useTheme} from '@src/app/providers/themeProvider';

const ThemeSwitcher = () => {
  const {theme, toggleTheme} = useTheme();
  const isLightMode = theme === Theme.LIGHT;

  return (
    <View style={styles.languageSwitcher}>
      <View>
        <AppText
          size={TextSize.LEVEL_5}
          text={`${isLightMode ? 'Light' : 'Dark'} mode`}
        />
      </View>
      <Switch
        style={styles.switcher}
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isLightMode ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleTheme}
        value={isLightMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  languageSwitcher: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
  switcher: {
    transform: [
      {scaleX: Platform.OS === 'ios' ? 0.8 : 1.2},
      {scaleY: Platform.OS === 'ios' ? 0.8 : 1.2},
    ],
  },
});

export const Wrapper = memo(ThemeSwitcher);
