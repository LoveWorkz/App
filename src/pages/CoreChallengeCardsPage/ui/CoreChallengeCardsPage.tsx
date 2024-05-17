import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {
  challengeStore,
  CoreChallengeCard,
  CoreChallengeCardsFooter,
} from '@src/entities/Challenge';
import {verticalScale} from '@src/shared/lib/Metrics';
import {HorizontalSlide} from '@src/shared/ui/HorizontalSlide/HorizontalSlide';
import {CARD_WIDTH} from '@src/shared/consts/common';
import {challengeGroupStore} from '@src/entities/ChallengeGroup';
import {challengesStore} from '@src/pages/ChallengesPage';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';

const CoreChallengeCardsPage = () => {
  const language = useLanguage();

  const challenges = challengesStore.challenges;
  const currentCoreChallengeGroup =
    challengeGroupStore.currentCoreChallengeGroup;
  const currentCoreChallenge = challengeStore.coreChallenge;

  const coreChallengesList = useMemo(() => {
    if (!currentCoreChallengeGroup) {
      return [];
    }

    return challenges
      .filter(item => item.groupId === currentCoreChallengeGroup.id)
      .map(item => ({
        ...item,
        groupName: currentCoreChallengeGroup.displayName[language],
      }));
  }, [currentCoreChallengeGroup, challenges, language]);

  const defaultChallengeNumber = useMemo(() => {
    if (!currentCoreChallenge) {
      return 1;
    }
  
    return challengeStore.getChallengeNumber({
      challenges: coreChallengesList,
      id: currentCoreChallenge.id,
    });
  }, [currentCoreChallenge, coreChallengesList]);
  
  return (
    <View style={styles.CoreChallengeDetailsPage}>
      <HorizontalSlide
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
  },
});
