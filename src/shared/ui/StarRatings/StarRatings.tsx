import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {StarIcon} from '@src/shared/assets/icons/Star';
import {useColors} from '@src/app/providers/colorsProvider';

interface AvatarProps {
  size: number;
  count: number;
}

export const StarRatings = memo((props: AvatarProps) => {
  const {count, size} = props;
  const colors = useColors();

  const array = [];

  for (let i = 0; i < size; i++) {
    if (i < count) {
      array.push({
        active: true,
      });
    } else {
      array.push({
        active: false,
      });
    }
  }

  return (
    <View style={styles.Stars}>
      {array.map((item, index) => {
        return (
          <SvgXml
            key={index}
            xml={StarIcon}
            fill={item.active ? '#FFC727' : colors.bgColor}
            style={styles.icon}
          />
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  Stars: {
    flexDirection: 'row',
  },
  icon: {
    width: 14,
    height: 14,
    marginHorizontal: 4,
  },
});
