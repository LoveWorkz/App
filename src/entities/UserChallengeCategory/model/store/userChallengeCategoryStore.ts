import {makeAutoObservable, runInAction} from 'mobx';

import firestore from '@react-native-firebase/firestore';
import {Collections} from '@src/shared/types/firebase';
import {challengesStore} from '@src/pages/ChallengesPage';
import {ChallengeCategoriesNames} from '@src/entities/ChallengeCategory';
import userStore from '@src/entities/User/model/store/userStore';
import {userChallengeCategoryInitData} from '../lib/userChallengeCategory';
import {UserChallengeCategoryType} from '../types/userChallengeCategoryType';

class UserChallengeCategoryStore {
  userChallengeCategory: null | UserChallengeCategoryType = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchUserChallengeCategory = async () => {
    try {
      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const currentChallengeCategory = challengesStore.challengeCategory;
      const userId = userStore.authUserId;
      if (!userId) {
        return;
      }
      if (!currentChallengeCategory) {
        return;
      }

      const userChallengeCategoryData = await firestore()
        .collection(Collections.USER_CHALLENGE_CATEGORIES)
        .doc(userId)
        .get({source});
      const userChallengeCategory =
        userChallengeCategoryData.data() as UserChallengeCategoryType;

      if (!userChallengeCategory) {
        return;
      }

      const currenetChallengeCategory =
        userChallengeCategory.challengeCategory[
          currentChallengeCategory.currentChallengeCategory as ChallengeCategoriesNames
        ];

      runInAction(() => {
        this.userChallengeCategory = userChallengeCategory;
        challengesStore.setIsAllChallengesSelected(
          currenetChallengeCategory.isAllChallengesSelected,
        );
        // keeping selected Challenges Ids separately for updating challenges
        challengesStore.setSelectedChallengesIds(
          currenetChallengeCategory.selectedChallengesIds,
        );
      });
    } catch (e) {
      console.log(e);
    }
  };

  setUserChallengeCategory = async (userId: string) => {
    try {
      await firestore()
        .collection(Collections.USER_CHALLENGE_CATEGORIES)
        .doc(userId)
        .set(userChallengeCategoryInitData);
    } catch (e) {
      console.log(e);
    }
  };

  updateUserChallengeCategory = async ({
    field,
    data,
    challengeCategoryName,
  }: {
    field: string;
    data: any;
    challengeCategoryName?: ChallengeCategoriesNames;
  }) => {
    try {
      const isOffline = await userStore.getIsUserOffline();

      const currentChallengeCategory = challengesStore.challengeCategory;
      const userId = userStore.authUserId;
      if (!userId) {
        return;
      }
      if (!currentChallengeCategory) {
        return;
      }

      if (isOffline) {
        firestore()
          .collection(Collections.USER_CHALLENGE_CATEGORIES)
          .doc(userId)
          .update({
            [`challengeCategory.${
              challengeCategoryName ||
              currentChallengeCategory.currentChallengeCategory
            }.${field}`]: data,
          });
      } else {
        await firestore()
          .collection(Collections.USER_CHALLENGE_CATEGORIES)
          .doc(userId)
          .update({
            [`challengeCategory.${
              challengeCategoryName ||
              currentChallengeCategory.currentChallengeCategory
            }.${field}`]: data,
          });
      }
    } catch (e) {
      console.log(e);
    }
  };
  deleteUserChallengeCategory = async (userId: string) => {
    try {
      await firestore()
        .collection(Collections.USER_CHALLENGE_CATEGORIES)
        .doc(userId)
        .delete();
    } catch (e) {
      console.log(e);
    }
  };
}

export default new UserChallengeCategoryStore();
