import React, {memo} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import {verticalScale} from '@src/shared/lib/Metrics';
import {Carousel} from '@src/shared/ui/Carousel/Carousel';
import {windowWidthMinusPaddings} from '@src/app/styles/GlobalStyle';
import {AboutItem} from './AboutItem/AboutItem';
import {data} from '../lib/howToUse';

const AboutPage = () => {
  return (
    <SafeAreaView style={styles.about}>
      <Carousel
        itemWidth={windowWidthMinusPaddings}
        isBottomPagination
        data={data}
        Component={AboutItem}
        paginationStyle={styles.paginationStyle}
        isSmallDotPagination={false}
      />
    </SafeAreaView>
  );
};

export const Wrapper = memo(AboutPage);

const styles = StyleSheet.create({
  about: {
    flex: 1,
  },
  paginationStyle: {
    alignItems: 'center',
    marginTop: verticalScale(60),
  },
});
