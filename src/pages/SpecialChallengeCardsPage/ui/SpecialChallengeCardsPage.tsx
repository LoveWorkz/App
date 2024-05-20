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
import {challengeGroupStore} from '@src/entities/ChallengeGroup';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';

const SpecialChallengeCardsPage = () => {
  const language = useLanguage();

  const specialChallenge = challengeStore.specialChallenge;

  const isChallengeDoneButtonVisible =
    challengeStore.isChallengeDoneButtonVisible;
  const isSelectingChallenge = challengeStore.isSelectingChallenge;

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

  const listWithMetadata = useMemo(() => {
    if (!specialChallenge) {
      return [];
    }

    const {challengeCardsData} = specialChallenge;

    const listWithSpecialChallengeId = challengeCardsData.map(item => ({
      ...item,
      specialChallengeId: specialChallenge.id,
      isSelectingChallenge,
      isChecked: specialChallenge.isChecked,
    }));

    // If the challenge done button is not visible, return the original data.
    if (!isChallengeDoneButtonVisible) {
      return listWithSpecialChallengeId;
    }

    // When the button is visible, add a `showButton: true` property to each item.
    return listWithSpecialChallengeId.map(item => ({
      ...item,
      showButton: true,
    }));
  }, [isChallengeDoneButtonVisible, specialChallenge, isSelectingChallenge]);

  if (!specialChallenge) {
    return null;
  }

  const specialChallengeGroup =
    challengeGroupStore.getSpecialChallengeGroupById(specialChallenge.groupId);

  return (
    <View style={styles.ChallengeCardsPage}>
      <View style={styles.topPart}>
        <ChallengeCategoryBlock
          text={
            specialChallengeGroup
              ? specialChallengeGroup.displayName[language]
              : ''
          }
        />
      </View>
      <HorizontalSlide
        onSwipeHandler={onSwipeHandler}
        data={listWithMetadata}
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

export default memo(observer(SpecialChallengeCardsPage));

const styles = StyleSheet.create({
  ChallengeCardsPage: {
    flex: 1,
    marginTop: verticalScale(20),
  },
  topPart: {
    alignItems: 'center',
    top: verticalScale(3),
  },
});
