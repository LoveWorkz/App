import {makeAutoObservable} from 'mobx';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {challengeStore, ChallengeType} from '@src/entities/Challenge';

class CoreChallengeCardsPageStore {
  constructor() {
    makeAutoObservable(this);
  }

  initSessionFlow = async ({
    coreChallengesList,
    currentCoreChallengeGroupId,
  }: {
    coreChallengesList: ChallengeType[];
    currentCoreChallengeGroupId: string;
  }) => {
    try {
      const firstChallenge = coreChallengesList[0];
      firstChallenge && challengeStore.setCoreChallenge(firstChallenge);

      await challengeStore.initLockedChallengeId(currentCoreChallengeGroupId);
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new CoreChallengeCardsPageStore();
