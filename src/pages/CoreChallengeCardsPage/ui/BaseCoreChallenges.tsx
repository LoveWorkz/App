import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {
  challengeStore,
  ChallengeType,
  CoreChallengeCard,
  CoreChallengeCardsFooter,
} from '@src/entities/Challenge';
import {verticalScale} from '@src/shared/lib/Metrics';
import {ChallengeGroupType} from '@src/entities/ChallengeGroup';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';

interface BaseCoreChallengesProps {
  currentCoreChallengeGroup: ChallengeGroupType<ChallengeType[]>;
}

const BaseCoreChallenges = (props: BaseCoreChallengesProps) => {
  const {currentCoreChallengeGroup} = props;

  const language = useLanguage();

  const {coreChallenge} = challengeStore;
  if (!coreChallenge) {
    return <></>;
  }

  return (
    <View style={styles.BaseCoreChallenges}>
      <CoreChallengeCard
        isSessionFlow={false}
        id={coreChallenge.id}
        description={coreChallenge.description}
        groupId={currentCoreChallengeGroup.id}
        groupName={currentCoreChallengeGroup.displayName[language]}
      />
      <CoreChallengeCardsFooter />
    </View>
  );
};

export default memo(observer(BaseCoreChallenges));

const styles = StyleSheet.create({
  BaseCoreChallenges: {
    flex: 1,
    marginTop: verticalScale(50),
    alignItems: 'center',
  },
});
