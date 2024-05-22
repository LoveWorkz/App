import {makeAutoObservable} from 'mobx';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {challengeStore, ChallengeType} from '@src/entities/Challenge';

class CoreChallengeCardsPageStore {
  isFetching: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setIsFetching = (isFetching: boolean) => {
    this.isFetching = isFetching;
  };

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
      this.setIsFetching(true);

      const firstChallenge = coreChallengesList[0];

      if (isSessionFlow) {
        firstChallenge && challengeStore.setCoreChallenge(firstChallenge);
      }

      await challengeStore.initLockedChallengeIds(currentCoreChallengeGroupId);
    } catch (e) {
      errorHandler({error: e});
    } finally {
      this.setIsFetching(false);
    }
  };
}

export default new CoreChallengeCardsPageStore();
