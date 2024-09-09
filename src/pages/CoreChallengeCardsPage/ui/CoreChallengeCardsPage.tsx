import React, {memo} from 'react';
import {StatusBar} from 'react-native';
import {observer} from 'mobx-react-lite';

import {challengeStore} from '@src/entities/Challenge';
import {challengeGroupStore} from '@src/entities/ChallengeGroup';
import SessionFlowCoreChallenges from './SessionFlowCoreChallenges';
import BaseCoreChallenges from './BaseCoreChallenges';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '@src/shared/lib/navigation/navigation';

const CoreChallengeCardsPage = () => {
  const {currentCoreChallengeGroup} = challengeGroupStore;
  const {isSessionFlow} = challengeStore;
  const {params} =
    //@ts-ignore
    useRoute<RouteProp<RootStackParamList, 'CoreChallengeIntroCard'>>();

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
        isFavorite={params?.isFavorite}
      />
    </>
  );
};

export default memo(observer(CoreChallengeCardsPage));
