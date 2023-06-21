import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useHeaderHeight} from '@react-navigation/elements';

import {ThemeSwitcher} from '@src/widgets/ThemeSwitcher';
import {QuotesSwitcher} from '@src/widgets/Quotes';
import {verticalScale} from '@src/shared/lib/Metrics';
import {LanguageSwitcher} from '@src/widgets/LanguageSwitcher';
import ShareUs from './ShareUs/ShareUs';
import {windowHeightMinusPaddings} from '@src/app/styles/GlobalStyle';
import {isPlatformIos} from '@src/shared/consts/common';
import SettingItems from './SettingItems/SettingItems';
import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy';
import SettingsUserCard from './SettingsUserCard/SettingsUserCard';

const SettingsPage = () => {
  const statusBarHeight = getStatusBarHeight();
  const navbarHeaderHeight = useHeaderHeight();

  const navbarHeight = isPlatformIos
    ? navbarHeaderHeight
    : navbarHeaderHeight + statusBarHeight;

  return (
    <View
      style={[
        styles.settings,
        {
          minHeight: windowHeightMinusPaddings - navbarHeight,
        },
      ]}>
      <SettingsUserCard />
      <View style={styles.languageSwitcherWrapper}>
        <LanguageSwitcher />
      </View>
      <View style={styles.switchers}>
        <View style={styles.themeSwitcherWrapper}>
          <ThemeSwitcher />
        </View>
        <QuotesSwitcher />
      </View>
      <View>
        <SettingItems />
      </View>
      <View style={styles.bottomBlock}>
        <View style={styles.shareUs}>
          <ShareUs />
        </View>
        <PrivacyPolicy />
      </View>
    </View>
  );
};

export const ComponentWrapper = memo(SettingsPage);

const styles = StyleSheet.create({
  settings: {
    paddingBottom: verticalScale(180),
  },
  languageSwitcherWrapper: {
    marginBottom: verticalScale(25),
    marginTop: verticalScale(30),
  },
  switchers: {
    marginBottom: verticalScale(50),
  },
  themeSwitcherWrapper: {
    marginBottom: verticalScale(25),
  },

  bottomBlock: {
    width: '100%',
    position: 'absolute',
    bottom: verticalScale(50),
  },
  shareUs: {
    marginBottom: verticalScale(20),
  },
});
