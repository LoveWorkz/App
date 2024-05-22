import React, {memo, useCallback, useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {
  challengeStore,
  ChallengeType,
  CoreChallengeCard,
  CoreChallengeCardsFooter,
} from '@src/entities/Challenge';
import {verticalScale} from '@src/shared/lib/Metrics';
import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import {CARD_WIDTH} from '@src/shared/consts/common';
import {challengeGroupStore} from '@src/entities/ChallengeGroup';
import {challengesStore} from '@src/pages/ChallengesPage';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {sessionStore} from '@src/entities/Session';
import coreChallengeCardsPageStore from '../model/store/coreChallengeCardsPageStore';

const CoreChallengeCardsPage = () => {
  const language = useLanguage();

  const {challenges} = challengesStore;
  const {currentCoreChallengeGroup} = challengeGroupStore;
  const {isSessionFlow} = challengeStore;
  const {session} = sessionStore;

  const coreChallengesList = useMemo(() => {
    if (!currentCoreChallengeGroup) {
      return [];
    }

    let filteredChallenges = challenges.filter(
      challenge => challenge.groupId === currentCoreChallengeGroup.id,
    );

    if (isSessionFlow) {
      if (!session) {
        return [];
      }

      const {isCurrent, linkedCoreChallenge} = session;
      if (isCurrent) {
        filteredChallenges = filteredChallenges.filter(
          challenge => !challenge.isChecked,
        );
      } else {
        const sessionChallenge = filteredChallenges.find(
          challenge => challenge.id === linkedCoreChallenge,
        );
        filteredChallenges = sessionChallenge ? [sessionChallenge] : [];
      }
    }

    return filteredChallenges.map(challenge => ({
      ...challenge,
      groupName: currentCoreChallengeGroup.displayName[language],
      isSessionFlow,
      isChallengeCompleted: !session?.isCurrent,
    }));
  }, [challenges, currentCoreChallengeGroup, language, isSessionFlow, session]);

  useEffect(() => {
    if (!currentCoreChallengeGroup) {
      return;
    }

    coreChallengeCardsPageStore.init({
      isSessionFlow,
      coreChallengesList,
      currentCoreChallengeGroupId: currentCoreChallengeGroup.id,
    });

    return () => {
      challengeStore.clearForm();
    };
  }, [coreChallengesList, isSessionFlow, currentCoreChallengeGroup]);

  const defaultChallengeNumber = useMemo(() => {
    return challengeStore.getDefaultChallengeNumberForCardsPage({
      coreChallengesList,
    });
  }, [coreChallengesList]);

  const handleSwipe = useCallback((challenge: ChallengeType) => {
    challengeStore.coreChallengeCardsSwipeHandler(challenge);
  }, []);

  return (
    <View style={styles.CoreChallengeDetailsPage}>
      <HorizontalSlide
        onSwipeHandler={handleSwipe}
        defaultElement={defaultChallengeNumber}
        data={coreChallengesList}
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

export default memo(observer(CoreChallengeCardsPage));

const styles = StyleSheet.create({
  CoreChallengeDetailsPage: {
    flex: 1,
    marginTop: verticalScale(20),
    alignItems: 'center',
  },
  skeletonCard: {
    marginTop: verticalScale(30),
    width: '90%',
  },
});
