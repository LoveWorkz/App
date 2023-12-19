import React, {memo, ReactNode, useCallback} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {SmallArrowRightIcon} from '@src/shared/assets/icons/SmallArrowRight';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';

interface SettingItem {
  Icon: string;
  text: string;
  path?: AppRouteNames;
  onPress?: () => void;
  RightSideComponent?: ReactNode;
  isPressable?: boolean;
}

const SettingItem = (props: SettingItem) => {
  const {
    Icon,
    text,
    path,
    onPress,
    RightSideComponent,
    isPressable = true,
  } = props;
  const colors = useColors();

  const onPressHandler = useCallback(() => {
    path && navigation.navigate(path);
    onPress?.();
  }, [path, onPress]);

  return (
    <TouchableOpacity
      disabled={!isPressable}
      style={[
        styles.settingItem,
        {borderBottomColor: colors.borderBottomColor},
      ]}
      onPress={onPressHandler}>
      <View style={styles.leftSide}>
        <SvgXml xml={Icon} style={[styles.icon]} />
        <AppText
          style={[styles.text, {color: colors.primaryTextColor}]}
          size={TextSize.LEVEL_4}
          weight={'600'}
          text={text}
        />
      </View>
      {RightSideComponent ? (
        RightSideComponent
      ) : (
        <SvgXml
          xml={SmallArrowRightIcon}
          stroke={colors.primaryTextColor}
          style={styles.arrowRightIcon}
        />
      )}
    </TouchableOpacity>
  );
};

export default memo(SettingItem);

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  leftSide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    height: horizontalScale(18),
    width: horizontalScale(18),
  },
  text: {
    left: horizontalScale(15),
    bottom: verticalScale(2),
  },
  arrowRightIcon: {
    height: horizontalScale(12),
    width: horizontalScale(12),
  },
});
