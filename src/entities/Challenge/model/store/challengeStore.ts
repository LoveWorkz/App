import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import challengesStore from '@src/pages/ChallengesPage/model/store/challengesStore';

class ChallengeStore {
  constructor() {
    makeAutoObservable(this);
  }

  updateChallenge = async (id: string) => {
    try {
      const currentChallengeCategory = challengesStore.challengeCategory;
      const userId = userStore.authUserId;
      if (!userId) {
        return;
      }
      if (!currentChallengeCategory) {
        return;
      }

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

      await firestore()
        .collection(Collections.USER_CHALLENGE_CATEGORIES)
        .doc(userId)
        .update({
          [`challengeCategory.${currentChallengeCategory.currentChallengeCategory}.selectedChallengesIds`]:
            newSelectedChallengesIds,
        });
      this.updateLocalChallenge(id);
    } catch (e) {
      console.log(e);
    }
  };

  updateLocalChallenge = (id: string) => {
    const newChallenges = challengesStore.filteredChallengesList.map(
      challenge => {
        if (challenge.id === id) {
          return {...challenge, isChecked: !challenge.isChecked};
        }

        return {...challenge};
      },
    );

    runInAction(() => {
      challengesStore.filteredChallengesList = newChallenges;
    });
  };
}

export default new ChallengeStore();
