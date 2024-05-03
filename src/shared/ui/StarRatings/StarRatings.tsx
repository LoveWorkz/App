import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  outlineStar,
  selectedStar,
  unselectedStar,
} from '@src/shared/assets/images';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '../AppText/AppText';

// Function to render each star
const renderStar = ({
  index,
  count,
  imageSize,
  onRate,
  readOnly,
  size,
  horizontalPaddings,
  prefix,
  postfix,
  textColor,
}: {
  index: number;
  count: number;
  imageSize: number;
  onRate: (value: number) => void;
  readOnly: boolean;
  horizontalPaddings?: number;
  size: number;
  prefix?: string;
  postfix?: string;
  textColor: string;
}) => {
  const isSelected = index < count;
  const starImage = isSelected ? selectedStar : outlineStar;

  const isFirstElement = index === 0;
  const isLastElement = index === size - 1;

  return (
    <View key={index} style={styles.starWrapper}>
      <TouchableOpacity
        disabled={readOnly}
        onPress={() => onRate(index + 1)}
        style={{
          marginHorizontal: horizontalScale(
            horizontalPaddings || imageSize / 6,
          ),
        }}>
        <FastImage
          style={{
            height: horizontalScale(imageSize),
            width: horizontalScale(imageSize),
          }}
          source={starImage}
        />
      </TouchableOpacity>
      {isFirstElement && prefix && (
        <AppText
          weight="600"
          style={[styles.text, {color: textColor}]}
          align={'center'}
          size={TextSize.LEVEL_4}
          text={prefix}
        />
      )}
      {isLastElement && postfix && (
        <AppText
          weight="600"
          style={[styles.text, {color: textColor}]}
          align={'center'}
          size={TextSize.LEVEL_4}
          text={postfix}
        />
      )}
    </View>
  );
};

interface StarRatingsProps {
  count: number;
  size?: number;
  imageSize?: number;
  readOnly?: boolean;
  horizontalPaddings?: number;
  prefix?: string;
  postfix?: string;
  onRate?: (value: number) => void;
}

export const StarRatings = memo((props: StarRatingsProps) => {
  const {
    count,
    size = 5,
    imageSize = 18,
    readOnly = false,
    horizontalPaddings,
    prefix,
    postfix,
    onRate,
  } = props;

  const arrayFromNumber = Array.from({length: size}, (_, index) => index + 1);

  const colors = useColors();

  const onRateHandler = (newRating: number) => {
    if (readOnly) {
      return;
    }

    onRate?.(newRating);
  };

  return (
    <View style={styles.Stars}>
      {arrayFromNumber.map((_, index) => {
        return renderStar({
          index,
          count,
          imageSize,
          onRate: onRateHandler,
          readOnly,
          horizontalPaddings,
          size,
          prefix,
          postfix,
          textColor: colors.white,
        });
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  Stars: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    marginTop: verticalScale(10),
  },
  starWrapper: {
    alignItems: 'center',
  },
});
