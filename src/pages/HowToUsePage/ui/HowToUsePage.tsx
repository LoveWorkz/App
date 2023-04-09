import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Carousel} from '@src/shared/ui/Carousel/Carousel';
import {data} from '../lib/howToUse';
import {Wrapper as HowToUseItem} from './HowToUseItem/HowToUseItem';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';

const HowToUsePage = () => {
  const paddings = globalPadding + globalPadding;

  return (
    <SafeAreaView style={styles.howToUse}>
      <Carousel
        itemWidth={windowWidth - paddings}
        isBottomPagination
        data={data}
        Component={HowToUseItem}
      />
    </SafeAreaView>
  );
};

export const Wrapper = memo(HowToUsePage);

const styles = StyleSheet.create({
  howToUse: {
    flex: 1,
  },
});
