import React, {memo, useCallback, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {StyleSheet, View} from 'react-native';

import {
  ChallengeCardsFooter,
  ChallengeCategoryBlock,
} from '@src/entities/Challenge';
import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import { verticalScale } from '@src/shared/lib/Metrics';
import {CARD_WIDTH} from '@src/shared/consts/common';
import ChallengeCard from '@src/entities/Challenge/ui/ChallengeCards/ChallengeCard';
import challengeCardsPageStore from '../../../model/store/challengeCardsPageStore';

export const EffectiveApologies = () => {
  const isChallengeDoneButtonVisible =
    challengeCardsPageStore.isChallengeDoneButtonVisible;
  const data = challengeCardsPageStore.data;

  const onSwipeHandler = useCallback(({id}: {id: number}) => {
    challengeCardsPageStore.swipe(id);
  }, []);

  const list = useMemo(() => {
    if (!isChallengeDoneButtonVisible) {
      return data;
    }

    return data.map(item => ({...item, showButton: true}));
  }, [isChallengeDoneButtonVisible]);

  return (
    <View>
      <View style={styles.topPart}>
        <ChallengeCategoryBlock text="Friendship" />
      </View>
      <HorizontalSlide
        onSwipeHandler={onSwipeHandler}
        data={list}
        Component={ChallengeCard}
        isSlideEnabled
        itemWidth={CARD_WIDTH}
        Footer={ChallengeCardsFooter}
        showLength={4}
        opacityInterval={0.3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topPart: {
    alignItems: 'center',
    top: verticalScale(-2)
  },
});

export default memo(observer(EffectiveApologies));
