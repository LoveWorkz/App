import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';

import {
  ChallengeCard,
  ChallengeCardsFooter,
  ChallengeCategoryBlock,
  challengeStore,
} from '@src/entities/Challenge';
import {verticalScale} from '@src/shared/lib/Metrics';
import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import {CARD_WIDTH} from '@src/shared/consts/common';

const ChallengeCardsPage = () => {
  const specialChallenge = challengeStore.specialChallenge;

  const isChallengeDoneButtonVisible =
    challengeStore.isChallengeDoneButtonVisible;

  useFocusEffect(
    useCallback(() => {
      challengeStore.updateChallengeButtonVisibility();

      return () => {
        challengeStore.setIsChallengeDoneButtonVisible(false);
      };
    }, []),
  );

  const onSwipeHandler = useCallback(({cardId}: {cardId: string}) => {
    challengeStore.swipeSpecialChallengeCard(cardId);
  }, []);

  const listWithShowButton = useMemo(() => {
    if (!specialChallenge) {
      return [];
    }
  
    const { challengeCardsData } = specialChallenge;
  
    // If the challenge done button is not visible, return the original data.
    if (!isChallengeDoneButtonVisible) {
      return challengeCardsData;
    }
  
    // When the button is visible, add a `showButton: true` property to each item.
    return challengeCardsData.map(item => ({ ...item, showButton: true }));
  }, [isChallengeDoneButtonVisible, specialChallenge]);

  if (!specialChallenge) {
    return null;
  }

  return (
    <View style={styles.ChallengeCardsPage}>
      <View style={styles.topPart}>
        <ChallengeCategoryBlock text="Friendship" />
      </View>
      <HorizontalSlide
        onSwipeHandler={onSwipeHandler}
        data={listWithShowButton}
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

export default memo(observer(ChallengeCardsPage));

const styles = StyleSheet.create({
  ChallengeCardsPage: {
    flex: 1,
  },
  topPart: {
    alignItems: 'center',
    top: verticalScale(-2),
  },
});
