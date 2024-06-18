import React, {memo} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {observer} from 'mobx-react-lite';

import {challengeStore} from '@src/entities/Challenge';
import {challengeGroupStore} from '@src/entities/ChallengeGroup';
import SessionFlowCoreChallenges from './SessionFlowCoreChallenges';
import BaseCoreChallenges from './BaseCoreChallenges';

const CoreChallengeCardsPage = () => {
  const {currentCoreChallengeGroup} = challengeGroupStore;
  const {isSessionFlow} = challengeStore;

  if (!currentCoreChallengeGroup) {
    return <></>;
  }

  if (isSessionFlow) {
    return (
      <>
        <StatusBar barStyle={'light-content'} />
        <SessionFlowCoreChallenges
          isSessionFlow={isSessionFlow}
          currentCoreChallengeGroup={currentCoreChallengeGroup}
        />
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle={'light-content'} />
      <BaseCoreChallenges
        currentCoreChallengeGroup={currentCoreChallengeGroup}
      />
    </>
  );
};

export default memo(observer(CoreChallengeCardsPage));

const styles = StyleSheet.create({
  CoreChallengeDetailsPage: {
    flex: 1,
  },
});
