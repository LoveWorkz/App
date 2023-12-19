import React, {memo} from 'react';
import {StyleSheet, Switch, View} from 'react-native';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {isPlatformIos} from '@src/shared/consts/common';
import {verticalScale} from '@src/shared/lib/Metrics';

interface NotificationItemProps {
  onChange: (visible: boolean) => void;
  value: boolean;
  title: string;
  description: string;
}

const NotificationItem = (props: NotificationItemProps) => {
  const {onChange, value, title, description} = props;

  const colors = useColors();

  return (
    <View
      style={[
        styles.NotificationItem,
        {borderBottomColor: colors.borderBottomColor},
      ]}>
      <View>
        <AppText
          style={[styles.title, {color: colors.primaryTextColor}]}
          size={TextSize.LEVEL_5}
          text={title}
          weight={'700'}
        />

        <AppText
          style={{color: colors.primaryTextColor}}
          size={TextSize.LEVEL_4}
          text={description}
        />
      </View>
      <Switch
        style={styles.switcher}
        trackColor={{false: '#B4BCF4', true: '#847AED'}}
        thumbColor={'white'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onChange}
        value={value}
      />
    </View>
  );
};

export default memo(NotificationItem);

const styles = StyleSheet.create({
  NotificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingBottom: verticalScale(20),
    marginBottom: verticalScale(20),
  },

  title: {
    marginBottom: verticalScale(6),
  },

  switcher: {
    position: 'absolute',
    right: 0,
    top: 0,

    transform: [
      {scaleX: isPlatformIos ? 0.8 : 1.2},
      {scaleY: isPlatformIos ? 0.8 : 1.2},
    ],
  },
});
