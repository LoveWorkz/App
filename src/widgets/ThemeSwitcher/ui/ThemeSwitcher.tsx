import React, {memo} from 'react';
import {StyleSheet, View, Switch} from 'react-native';
import {useTranslation} from 'react-i18next';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import {isPlatformIos} from '@src/shared/consts/common';
import {useColors} from '@src/app/providers/colorsProvider';

const ThemeSwitcher = () => {
  const {theme, toggleTheme} = useTheme();
  const colors = useColors();
  const {t} = useTranslation();
  const isLightMode = theme === Theme.Dark;

  return (
    <View style={styles.languageSwitcher}>
      <View>
        <AppText
          style={{color: colors.primaryTextColor}}
          size={TextSize.LEVEL_5}
          text={t('settings.dark_mode')}
        />
      </View>
      <Switch
        style={styles.switcher}
        trackColor={{false: '#767577', true: '#ECB7FF'}}
        thumbColor={'white'}
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
      {scaleX: isPlatformIos ? 0.8 : 1.2},
      {scaleY: isPlatformIos ? 0.8 : 1.2},
    ],
  },
});

export const Wrapper = memo(ThemeSwitcher);
