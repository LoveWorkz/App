import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Carousel} from '@src/shared/ui/Carousel/Carousel';
import {windowWidthMinusPaddings} from '@src/app/styles/GlobalStyle';
import {verticalScale} from '@src/shared/lib/Metrics';
import {data} from '../lib/howToUse';
import {Wrapper as HowToUseItem} from './HowToUseItem/HowToUseItem';

const HowToUsePage = () => {
  return (
    <SafeAreaView style={styles.howToUse}>
      <Carousel
        itemWidth={windowWidthMinusPaddings}
        isBottomPagination
        data={data}
        Component={HowToUseItem}
        paginationStyle={styles.paginationStyle}
        isSmallDotPagination={false}
      />
    </SafeAreaView>
  );
};

export const Wrapper = memo(HowToUsePage);

const styles = StyleSheet.create({
  howToUse: {
    flex: 1,
  },
  paginationStyle: {
    alignItems: 'center',
    marginTop: verticalScale(60),
  },
});
