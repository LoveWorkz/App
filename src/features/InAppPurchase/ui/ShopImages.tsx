import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {useColors} from '@src/app/providers/colorsProvider';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {
  shopImage1,
  shopImage2,
  shopImage3,
  shopImage4,
  shopImage5,
} from '@src/shared/assets/images';

const ShopImages = () => {
  const colors = useColors();

  return (
    <View style={styles.ShopImages}>
      <FastImage
        style={[styles.image1, styles.image]}
        source={shopImage1}
        resizeMode={'contain'}
      />
      <View style={[styles.image2Wrapper, {backgroundColor: colors.white}]}>
        <FastImage
          style={[styles.image2, styles.image]}
          source={shopImage2}
          resizeMode={'contain'}
        />
      </View>
      <View style={[styles.image3Wrapper, {backgroundColor: colors.white}]}>
        <FastImage
          style={[styles.image3, styles.image]}
          source={shopImage3}
          resizeMode={'contain'}
        />
      </View>
      <FastImage
        style={styles.image4}
        source={shopImage4}
        resizeMode={'contain'}
      />
      <FastImage
        style={styles.image5}
        source={shopImage5}
        resizeMode={'contain'}
      />
    </View>
  );
};

const borderRadius = moderateScale(10);

const styles = StyleSheet.create({
  ShopImages: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  image1: {
    height: horizontalScale(110),
    width: horizontalScale(110),
    position: 'absolute',
    left: 0,
    top: verticalScale(20),
  },
  image2Wrapper: {
    padding: horizontalScale(4),
    borderRadius: borderRadius,
  },
  image2: {
    height: horizontalScale(180),
    width: horizontalScale(180),
    alignItems: 'center',
  },
  image3Wrapper: {
    padding: horizontalScale(4),
    right: 0,
    bottom: verticalScale(24),
    position: 'absolute',
    borderRadius: borderRadius,
  },
  image3: {
    height: horizontalScale(110),
    width: horizontalScale(110),
  },
  image: {
    borderRadius: borderRadius,
  },
  image4: {
    height: horizontalScale(100),
    width: horizontalScale(100),
    position: 'absolute',
    left: horizontalScale(-15),
    bottom: verticalScale(-15),
  },
  image5: {
    height: horizontalScale(120),
    width: horizontalScale(120),
    position: 'absolute',
    right: horizontalScale(-25),
    bottom: verticalScale(-60),
  },
});

export default memo(ShopImages);
