import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {userChallengeCategoryStore} from '@src/entities/UserChallengeCategory';
import {challengesStore} from '@src/pages/ChallengesPage';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';

class ChallengeStore {
  constructor() {
    makeAutoObservable(this);
  }

  updateChallenge = async (id: string) => {
    try {
      crashlytics().log('Updating challenge.');

      const selectedChallengesIds = challengesStore.selectedChallengesIds;
      let newSelectedChallengesIds;

      if (selectedChallengesIds.includes(id)) {
        newSelectedChallengesIds = selectedChallengesIds.filter(
          challengesId => challengesId !== id,
        );
      } else {
        newSelectedChallengesIds = [...selectedChallengesIds, id];
      }

      challengesStore.setSelectedChallengesIds(newSelectedChallengesIds);

      await userChallengeCategoryStore.updateUserChallengeCategory({
        field: 'selectedChallengesIds',
        data: newSelectedChallengesIds,
      });
      this.updateLocalChallenge(id);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateLocalChallenge = (id: string) => {
    const newFilteredChallenges = challengesStore.filteredChallengesList.map(
      challenge => {
        if (challenge.id === id) {
          return {...challenge, isChecked: !challenge.isChecked};
        }

        return {...challenge};
      },
    );

    const newChallenges = challengesStore.challenges.map(challenge => {
      if (challenge.id === id) {
        return {...challenge, isChecked: !challenge.isChecked};
      }

      return {...challenge};
    });

    runInAction(() => {
      challengesStore.filteredChallengesList = newFilteredChallenges;
      challengesStore.challenges = newChallenges;
    });
  };

  selectChallenge = async ({id}: {id: string}) => {
    try {
      crashlytics().log('Selecting challenge.');

      await this.updateChallenge(id);
      await challengesStore.checkIfAllChallengesSelected();
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new ChallengeStore();
