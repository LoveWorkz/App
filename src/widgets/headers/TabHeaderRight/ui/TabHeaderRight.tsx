import React, {memo} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {SettingsIcon} from '@src/shared/assets/icons/Settings';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';

const TabHeaderRight = () => {
  const colors = useColors();

  const onSettingsPressHandler = () => {
    navigation.navigate(AppRouteNames.SETTINGS);
  };

  return (
    <Pressable onPress={onSettingsPressHandler} style={styles.TabHeaderRight}>
      <SvgXml
        xml={SettingsIcon}
        style={styles.icon}
        stroke={colors.primaryTextColor}
      />
    </Pressable>
  );
};

export default memo(TabHeaderRight);

const styles = StyleSheet.create({
  TabHeaderRight: {
    justifyContent: 'center',
    marginRight: horizontalScale(20),
  },
  icon: {
    height: verticalScale(24),
    width: verticalScale(24),
  },
});
