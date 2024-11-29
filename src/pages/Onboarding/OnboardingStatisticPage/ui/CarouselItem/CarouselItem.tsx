import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {StarRatings} from '@src/shared/ui/StarRatings/StarRatings';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {OnboardingCommentType} from '../../model/types/types';

const CarouselItem = (props: OnboardingCommentType) => {
  const {rate, comment, author} = props;

  const colors = useColors();

  return (
    <View style={[styles.CarouselItem, {backgroundColor: colors.white}]}>
      <StarRatings imageSize={25} count={rate} />
      <AppText
        style={styles.comment}
        weight={'500'}
        size={TextSize.LEVEL_5}
        text={comment}
        lineHeight={25}
        textColor="#395180"
      />
      <AppText
        weight={'700'}
        size={TextSize.LEVEL_5}
        text={author}
        textColor="#395180"
      />
    </View>
  );
};

export default memo(CarouselItem);

const styles = StyleSheet.create({
  CarouselItem: {
    width: horizontalScale(410),
    alignItems: 'center',
    borderRadius: moderateScale(20),
    padding: horizontalScale(25),
  },
  comment: {
    marginTop: verticalScale(15),
    marginBottom: verticalScale(15),
  },
});
