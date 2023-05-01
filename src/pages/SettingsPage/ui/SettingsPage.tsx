import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {ThemeSwitcher} from '@src/widgets/ThemeSwitcher';
import SettingItems from './SettingItems/SettingItems';
import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy';
import SettingsUserCard from './SettingsUserCard/SettingsUserCard';
import ShareUs from './ShareUs/ShareUs';
import Language from './Language/Language';

const SettingsPage = () => {
  return (
    <View style={styles.settings}>
      <SettingsUserCard />
      <View style={styles.languageSwitcherWrapper}>
        <Language />
      </View>
      <View style={styles.themeSwitcherWrapper}>
        <ThemeSwitcher />
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
    marginBottom: 30,
    marginTop: 40,
  },
  themeSwitcherWrapper: {
    marginBottom: 60,
  },
  bottomBlock: {
    width: '100%',
    position: 'absolute',
    bottom: 60,
  },
  shareUs: {
    marginBottom: 20,
  },
});
