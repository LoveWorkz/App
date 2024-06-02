import {makeAutoObservable} from 'mobx';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {challengeStore, ChallengeType} from '@src/entities/Challenge';

class CoreChallengeCardsPageStore {
  constructor() {
    makeAutoObservable(this);
  }

  init = async ({
    isSessionFlow,
    coreChallengesList,
    currentCoreChallengeGroupId,
  }: {
    isSessionFlow: boolean;
    coreChallengesList: ChallengeType[];
    currentCoreChallengeGroupId: string;
  }) => {
    try {
      const firstChallenge = coreChallengesList[0];

      if (isSessionFlow) {
        firstChallenge && challengeStore.setCoreChallenge(firstChallenge);
      }

      await challengeStore.initLockedChallengeId(currentCoreChallengeGroupId);
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new CoreChallengeCardsPageStore();
