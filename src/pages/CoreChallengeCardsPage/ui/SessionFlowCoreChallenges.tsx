import React, {memo, useCallback, useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {
  challengeStore,
  ChallengeType,
  CoreChallengeIntroCardWrapper,
  CoreChallengeCardsFooter,
} from '@src/entities/Challenge';
import {verticalScale} from '@src/shared/lib/Metrics';
import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import {CARD_WIDTH} from '@src/shared/consts/common';
import {ChallengeGroupType} from '@src/entities/ChallengeGroup';
import {challengesStore} from '@src/pages/ChallengesPage';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {sessionStore} from '@src/entities/Session';
import coreChallengeCardsPageStore from '../model/store/coreChallengeCardsPageStore';

interface SessionFlowCoreChallengesProps {
  isSessionFlow: boolean;
  currentCoreChallengeGroup: ChallengeGroupType<ChallengeType[]>;
}

const SessionFlowCoreChallenges = (props: SessionFlowCoreChallengesProps) => {
  const {currentCoreChallengeGroup} = props;
  const language = useLanguage();
  const {challenges} = challengesStore;
  const {session} = sessionStore;

  const coreChallengesList = useMemo(() => {
    if (!(currentCoreChallengeGroup && session)) {
      return [];
    }

    let filteredChallenges = [];

    const {isCurrent, linkedCoreChallenge} = session;

    if (isCurrent) {
      filteredChallenges = challenges.filter(
        challenge =>
          !challenge.isChecked &&
          challenge.groupId === currentCoreChallengeGroup.id,
      );
    } else {
      const sessionChallenge = challenges.find(
        challenge => challenge.id === linkedCoreChallenge,
      );
      filteredChallenges = sessionChallenge ? [sessionChallenge] : [];
    }

    return filteredChallenges.map(challenge => ({
      ...challenge,
      groupName: currentCoreChallengeGroup.displayName[language],
      isSessionFlow: true,
      isChallengeCompleted: !session?.isCurrent,
    }));
  }, [challenges, currentCoreChallengeGroup, language, session]);

  useEffect(() => {
    if (!currentCoreChallengeGroup) {
      return;
    }

    coreChallengeCardsPageStore.initSessionFlow({
      coreChallengesList,
      currentCoreChallengeGroupId: currentCoreChallengeGroup.id,
    });

    return () => {
      challengeStore.clearForm();
    };
  }, [coreChallengesList, currentCoreChallengeGroup]);

  const defaultChallengeNumber = useMemo(() => {
    return challengeStore.getDefaultChallengeNumberForCardsPage({
      coreChallengesList,
    });
  }, [coreChallengesList]);

  const handleSwipe = useCallback((challenge: ChallengeType) => {
    challengeStore.coreChallengeCardsSwipeHandler(challenge);
  }, []);

  const lockedChallengeId = challengeStore.lockedChallengeId;
  const lockedChallengeIndex = coreChallengesList.findIndex(
    challenge => challenge.id === lockedChallengeId,
  );
  const isChallengeLocked =
    challengeStore.isChallengeLockedIn(lockedChallengeId);

  return (
    <View style={styles.SessionFlowCoreChallenges}>
      <HorizontalSlide
        onSwipeHandler={handleSwipe}
        data={coreChallengesList}
        Component={CoreChallengeIntroCardWrapper}
        isSlideEnabled
        itemWidth={CARD_WIDTH}
        Footer={CoreChallengeCardsFooter}
        showLength={4}
        opacityInterval={0.3}
      />
    </View>
  );
};

export default memo(observer(SessionFlowCoreChallenges));

const styles = StyleSheet.create({
  SessionFlowCoreChallenges: {
    flex: 1,
    marginTop: verticalScale(20),
    alignItems: 'center',
  },
});
