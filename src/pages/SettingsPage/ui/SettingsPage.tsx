import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {LanguageSwitcher} from '@src/widgets/LanguageSwitcher';
import {Wrapper as SettingsUserCard} from './SettingsUserCard/SettingsUserCard';
import {ThemeSwitcher} from '@src/widgets/ThemeSwitcher';
import {Wrapper as SettingItems} from './SettingItems/SettingItems';
import {Wrapper as PrivacyPolicy} from './PrivacyPolicy/PrivacyPolicy';

const SettingsPage = () => {
  return (
    <View style={styles.settings}>
      <SettingsUserCard />
      <View style={styles.languageSwitcherWrapper}>
        <LanguageSwitcher />
      </View>
      <View style={styles.themeSwitcherWrapper}>
        <ThemeSwitcher />
      </View>
      <View>
        <SettingItems />
      </View>
      <PrivacyPolicy />
    </View>
  );
};

export const ComponentWrapper = memo(SettingsPage);

const styles = StyleSheet.create({
  settings: {
    flex: 1,
  },
  languageSwitcherWrapper: {
    marginTop: 25,
    marginBottom: 25,
  },
  themeSwitcherWrapper: {
    marginBottom: 40,
  },
});
