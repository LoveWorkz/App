import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Rating} from 'react-native-ratings';

import {useColors} from '@src/app/providers/colorsProvider';

interface AvatarProps {
  size: number;
  count: number;
  imageSize?: number;
  bgColor?: string;
}

export const StarRatings = memo((props: AvatarProps) => {
  const {count, size, imageSize = 18, bgColor} = props;
  const colors = useColors();

  return (
    <View style={styles.Stars}>
      <Rating
        type="custom"
        tintColor={bgColor || colors.bgColor}
        ratingCount={size}
        startingValue={count}
        readonly
        showReadOnlyText={false}
        imageSize={imageSize}
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
