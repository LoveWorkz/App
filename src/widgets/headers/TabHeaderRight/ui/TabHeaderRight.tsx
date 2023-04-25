import React, {memo} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {SettingsIcon} from '@src/shared/assets/icons/Settings';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

const TabHeaderRight = () => {
  const onSettingsPressHandler = () => {
    navigation.navigate(AppRouteNames.SETTINGS);
  };

  return (
    <Pressable onPress={onSettingsPressHandler} style={styles.TabHeaderRight}>
      <SvgXml xml={SettingsIcon} style={styles.icon} />
    </Pressable>
  );
};

export default memo(TabHeaderRight);

const styles = StyleSheet.create({
  TabHeaderRight: {
    justifyContent: 'center',
    marginRight: 10,
  },
  icon: {
    height: 24,
    width: 24,
  },
});
