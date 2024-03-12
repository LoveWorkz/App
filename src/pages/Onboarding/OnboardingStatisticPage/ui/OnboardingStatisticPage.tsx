import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {verticalScale} from '@src/shared/lib/Metrics';
import {Carousel} from '@src/shared/ui/Carousel/Carousel';
import {
  globalStyles,
  windowHeight,
  windowWidth,
} from '@src/app/styles/GlobalStyle';
import {useColors} from '@src/app/providers/colorsProvider';
import {isPlatformIos} from '@src/shared/consts/common';
import StatisticWrapper from './StatisticWrapper';
import {onboardingStyles} from '../../styles';

const OnboardingStatisticPage = () => {
  const colors = useColors();

  return (
    <View style={styles.OnboardingStatisticPage}>
      <Carousel
        style={styles.carouselStyle}
        itemWidth={windowWidth}
        isBottomPagination
        data={[{}, {}, {}, {}]}
        Component={StatisticWrapper}
        paginationStyle={styles.paginationStyle}
        isSmallDotPagination={false}
        paginationColor={colors.lavenderBlue}
      />
    </View>
  );
};

export default memo(OnboardingStatisticPage);

const bottom = verticalScale(isPlatformIos ? 75 : 100);

const styles = StyleSheet.create({
  OnboardingStatisticPage: {
    flex: 1,
  },
  paginationStyle: {
    alignItems: 'center',
    bottom,
    width: '100%',
  },
  carouselStyle: {
    ...globalStyles.statisticButtonZIndex,
    height: windowHeight,
    ...onboardingStyles.onboardingTop,
  },
});
