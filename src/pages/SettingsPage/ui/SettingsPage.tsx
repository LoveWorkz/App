import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {ThemeSwitcher} from '@src/widgets/ThemeSwitcher';
import {QuotesSwitcher} from '@src/widgets/Quotes';
import {verticalScale} from '@src/shared/lib/Metrics';
import {LanguageSwitcher} from '@src/widgets/LanguageSwitcher';
import SettingItems from './SettingItems/SettingItems';
import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy';
import SettingsUserCard from './SettingsUserCard/SettingsUserCard';
import ShareUs from './ShareUs/ShareUs';

const SettingsPage = () => {
  return (
    <View style={styles.settings}>
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
    flex: 1,
  },
  languageSwitcherWrapper: {
    marginBottom: verticalScale(30),
    marginTop: verticalScale(30),
  },
  switchers: {
    marginBottom: verticalScale(60),
  },
  themeSwitcherWrapper: {
    marginBottom: verticalScale(30),
  },

  bottomBlock: {
    width: '100%',
    position: 'absolute',
    bottom: verticalScale(60),
  },
  shareUs: {
    marginBottom: verticalScale(20),
  },
});
