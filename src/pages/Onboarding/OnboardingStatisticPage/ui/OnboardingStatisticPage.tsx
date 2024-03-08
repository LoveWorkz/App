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
import StatisticWrapper from './StatisticWrapper';

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

const styles = StyleSheet.create({
  OnboardingStatisticPage: {
    flex: 1,
  },
  paginationStyle: {
    alignItems: 'center',
    bottom: verticalScale(70),
    width: '100%',
  },
  carouselStyle: {
    ...globalStyles.statisticButtonZIndex,
    top: verticalScale(-40),
    height: windowHeight,
  },
});
