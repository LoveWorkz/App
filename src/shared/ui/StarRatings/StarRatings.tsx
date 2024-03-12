import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {selectedStar, unselectedStar} from '@src/shared/assets/images';
import {horizontalScale} from '@src/shared/lib/Metrics';

const renderStar = (index: number, count: number, imageSize: number) => {
  const isSelected = index < count;

  let starImage;
  if (isSelected) {
    starImage = selectedStar;
  } else {
    starImage = unselectedStar;
  }

  const size = horizontalScale(imageSize);

  return (
    <View style={{marginHorizontal: horizontalScale(size / 6)}} key={index.toString()}>
      <FastImage style={[styles.image, {height: size, width: size}]} source={starImage} />
    </View>
  );
};

interface AvatarProps {
  count: number;
  size?: number;
  imageSize?: number;
}

export const StarRatings = memo((props: AvatarProps) => {
  const {count, size = 5, imageSize = 18} = props;
  const arrayFromNumber = Array.from({length: size}, (_, index) => index + 1);

  return (
    <View style={styles.Stars}>
      {arrayFromNumber.map((_, index) => {
        return renderStar(index, count, imageSize);
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  Stars: {
    flexDirection: 'row',
  },
  image: {
    width: horizontalScale(25),
    height: horizontalScale(25),
  },
});
