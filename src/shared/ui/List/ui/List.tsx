import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {useColors} from '@src/app/providers/colorsProvider';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {StyleType} from '@src/shared/types/types';
import {AppText, TextSize} from '../../AppText/AppText';

interface ListProps {
  items: string[];
  style?: StyleType;
  title: string;
}

const List = (props: ListProps) => {
  const {items, style, title} = props;

  const colors = useColors();

  return (
    <View style={[style]}>
      <AppText
        style={[styles.title, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={title}
      />
      {items.map((item, index) => (
        <View style={styles.textWrapper} key={index.toString()}>
          <View style={styles.dot} />
          <AppText
            style={{color: colors.primaryTextColor}}
            size={TextSize.LEVEL_4}
            text={item}
          />
        </View>
      ))}
    </View>
  );
};

export default memo(List);

const styles = StyleSheet.create({
  textWrapper: {
    flexDirection: 'row',
  },
  dot: {
    height: horizontalScale(5),
    width: horizontalScale(5),
    backgroundColor: '#000',
    borderRadius: moderateScale(10),
    marginRight: horizontalScale(10),
    top: 8,
  },
  title: {
    marginBottom: verticalScale(10),
  },
});
