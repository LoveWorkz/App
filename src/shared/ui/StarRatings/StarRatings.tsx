import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Rating} from 'react-native-ratings';

import {useColors} from '@src/app/providers/colorsProvider';

interface AvatarProps {
  size: number;
  count: number;
}

export const StarRatings = memo((props: AvatarProps) => {
  const {count, size} = props;
  const colors = useColors();

  return (
    <View style={styles.Stars}>
      <Rating
        type="custom"
        tintColor={colors.bgColor}
        ratingCount={size}
        startingValue={count}
        readonly
        showReadOnlyText={false}
        imageSize={18}
        ratingBackgroundColor={colors.primaryTextColor}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  Stars: {
    alignItems: 'flex-start',
  },
});
