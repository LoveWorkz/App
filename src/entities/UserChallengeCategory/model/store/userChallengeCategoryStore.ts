import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import firestore from '@react-native-firebase/firestore';
import {Collections} from '@src/shared/types/firebase';
import {challengesStore} from '@src/pages/ChallengesPage';
import {ChallengeCategoryType} from '@src/entities/ChallengeCategory';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {CategoryKey} from '@src/entities/Category';
import userStore from '@src/entities/User/model/store/userStore';
import {favorites, favoriteStore, FavoriteType} from '@src/entities/Favorite';
import {userChallengeCategoryInitData} from '../lib/userChallengeCategory';
import {UserChallengeCategoryType} from '../types/userChallengeCategoryType';

class UserChallengeCategoryStore {
  userChallengeCategory: null | UserChallengeCategoryType = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchUserChallengeCategory = async () => {
    try {
      crashlytics().log('Fetching User Challenge Category.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const currentChallengeCategory = challengesStore.challengeCategory;
      const userId = userStore.userId;
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
          currentChallengeCategory.currentChallengeCategory as CategoryKey
        ];

      runInAction(() => {
        this.setChallengeFavorites({
          coreChallengeFavorites: userChallengeCategory.coreChallengeFavorites,
          specialChallengeFavorites:
            userChallengeCategory.specialChallengeFavorites,
        });

        // console.log(
        // 'TEST: currenetChallengeCategory',
        // currenetChallengeCategory,
        // );

        this.userChallengeCategory = userChallengeCategory;
        challengesStore.setIsAllChallengesSelected(
          currenetChallengeCategory.isAllChallengesSelected,
        );
        // keeping selected Challenges Ids separately for updating challenges
        challengesStore.setSelectedChallengesIds(
          userChallengeCategory.selectedChallengesIds,
        );

        challengesStore.setSelectedSpecialChallengesIds(
          userChallengeCategory.selectedSpecialChallengesIds,
        );
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchUserChallengeFavoritesAndSelectedIds = async () => {
    try {
      crashlytics().log('Fetching User Challenge Favorites And Selected Ids.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const userId = userStore.userId;
      if (!userId) {
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

      runInAction(() => {
        this.setChallengeFavorites({
          coreChallengeFavorites: userChallengeCategory.coreChallengeFavorites,
          specialChallengeFavorites:
            userChallengeCategory.specialChallengeFavorites,
        });
        challengesStore.setSelectedChallengesIds(
          userChallengeCategory.selectedChallengesIds,
        );
        challengesStore.setSelectedSpecialChallengesIds(
          userChallengeCategory.selectedSpecialChallengesIds,
        );
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setChallengeFavorites = ({
    coreChallengeFavorites,
    specialChallengeFavorites,
  }: {
    coreChallengeFavorites: FavoriteType;
    specialChallengeFavorites: FavoriteType;
  }) => {
    favoriteStore.setFavorites({
      favorites: coreChallengeFavorites,
      favoriteKey: 'coreChallenge',
    });

    favoriteStore.setFavorites({
      favorites: specialChallengeFavorites,
      favoriteKey: 'specialChallenge',
    });
  };

  setUserChallengeCategories = async (userId: string) => {
    try {
      crashlytics().log('Setting User Challenge Category.');

      const defaultChallengeCategories =
        await challengesStore.fetchDefaultChallengeCategories();
      if (!defaultChallengeCategories) {
        return;
      }

      const userChallengeCategories: Record<
        string,
        Partial<ChallengeCategoryType>
      > = {};

      defaultChallengeCategories.forEach(challengeCategory => {
        userChallengeCategories[challengeCategory.name] = {
          ...userChallengeCategoryInitData,
          isBlocked:
            challengeCategory.name === CategoryKey.Starter ||
            challengeCategory.name === ('All_In_One' as any)
              ? false
              : true,
        };
      });

      await firestore()
        .collection(Collections.USER_CHALLENGE_CATEGORIES)
        .doc(userId)
        .set({
          challengeCategory: userChallengeCategories,
          coreChallengeFavorites: favorites,
          specialChallengeFavorites: favorites,
          selectedSpecialChallengesIds: [],
          selectedChallengesIds: [],
          activeChallangesIds: []
        });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateUserChallengeCategory = async ({
    field,
    data,
    challengeCategoryName,
  }: {
    field: string;
    data: any;
    challengeCategoryName?: CategoryKey;
  }) => {
    try {
      crashlytics().log('Updating User Challenge Category.');

      const isOffline = await userStore.getIsUserOffline();

      const currentChallengeCategory = challengesStore.challengeCategory;
      const userId = userStore.userId;
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
      errorHandler({error: e});
    }
  };

  updateUserSelectedChallenges = async ({
    isCore,
    data,
  }: {
    isCore: boolean;
    data: any;
  }) => {
    try {
      crashlytics().log('Updating User Selected Challenges.');

      const isOffline = await userStore.getIsUserOffline();

      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      const field = isCore
        ? 'selectedChallengesIds'
        : 'selectedSpecialChallengesIds';

      if (isOffline) {
        firestore()
          .collection(Collections.USER_CHALLENGE_CATEGORIES)
          .doc(userId)
          .update({
            [field]: data,
          });
      } else {
        await firestore()
          .collection(Collections.USER_CHALLENGE_CATEGORIES)
          .doc(userId)
          .update({
            [field]: data,
          });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateUserChallengeFavorites = async ({
    data,
    isCore,
  }: {
    data: string | string[] | FavoriteType;
    isCore: boolean;
  }) => {
    try {
      crashlytics().log('Updating User challenge Favorites.');

      const isOffline = await userStore.getIsUserOffline();
      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      const fieldName = `${
        isCore ? 'coreChallengeFavorites' : 'specialChallengeFavorites'
      }.ids`;

      if (isOffline) {
        firestore()
          .collection(Collections.USER_CHALLENGE_CATEGORIES)
          .doc(userId)
          .update({
            [fieldName]: data,
          });
      } else {
        await firestore()
          .collection(Collections.USER_CHALLENGE_CATEGORIES)
          .doc(userId)
          .update({
            [fieldName]: data,
          });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  deleteChallengeFromFavorites = async ({
    challengeId,
    favoriteIds,
    isCore,
  }: {
    challengeId: string;
    favoriteIds: string[];
    isCore: boolean;
  }) => {
    try {
      const ids = favoriteIds;
      const newIds = ids.filter(id => {
        return id !== challengeId;
      });

      // eslint-disable-next-line @typescript-eslint/no-shadow
      const favorites: FavoriteType = {
        ids: newIds,
      };

      await this.updateUserChallengeFavorites({
        data: newIds,
        isCore,
      });

      return {
        isFavorite: false,
        favorites,
      };
    } catch (e) {
      errorHandler({error: e});
      return null;
    }
  };

  deleteUserChallengeCategory = async (userId: string) => {
    try {
      crashlytics().log('Deleting User Challenge Category.');

      await firestore()
        .collection(Collections.USER_CHALLENGE_CATEGORIES)
        .doc(userId)
        .delete();
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new UserChallengeCategoryStore();