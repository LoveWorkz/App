import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {
  CoreChallengeCard,
  CoreChallengeCardsFooter,
} from '@src/entities/Challenge';
import {verticalScale} from '@src/shared/lib/Metrics';
import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import {CARD_WIDTH} from '@src/shared/consts/common';

const CoreChallengeCardsPage = () => {
  return (
    <View style={styles.CoreChallengeDetailsPage}>
      <HorizontalSlide
        onSwipeHandler={() => {}}
        data={[{id: '1'}, {id: '2'}, {id: '2'}, {id: '2'}]}
        Component={CoreChallengeCard}
        isSlideEnabled
        itemWidth={CARD_WIDTH}
        Footer={CoreChallengeCardsFooter}
        showLength={4}
        opacityInterval={0.3}
      />
    </View>
  );
};

export default memo(CoreChallengeCardsPage);

const styles = StyleSheet.create({
  CoreChallengeDetailsPage: {
    flex: 1,
    marginTop: verticalScale(20),
  },
});
