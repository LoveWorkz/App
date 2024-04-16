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
        favoriteStore.setFavorites(userChallengeCategory.favorites);

        this.userChallengeCategory = userChallengeCategory;
        challengesStore.setIsAllChallengesSelected(
          currenetChallengeCategory.isAllChallengesSelected,
        );
        // keeping selected Challenges Ids separately for updating challenges
        challengesStore.setSelectedChallengesIds(
          currenetChallengeCategory.selectedChallengesIds,
        );

        challengesStore.setsSelectedSpecialChallengesIds(
          currenetChallengeCategory.selectedSpecialChallengesIds,
        );
      });
    } catch (e) {
      errorHandler({error: e});
    }
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
            challengeCategory.name === CategoryKey.How_To_Use
              ? false
              : true,
        };
      });

      await firestore()
        .collection(Collections.USER_CHALLENGE_CATEGORIES)
        .doc(userId)
        .set({
          challengeCategory: userChallengeCategories,
          favorites: favorites,
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

  updateUserChallengeFavorites = async ({
    data,
  }: {
    data: string | string[] | FavoriteType;
  }) => {
    try {
      crashlytics().log('Updating User challenge Favorites.');

      const isOffline = await userStore.getIsUserOffline();
      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      if (isOffline) {
        firestore()
          .collection(Collections.USER_CHALLENGE_CATEGORIES)
          .doc(userId)
          .update({
            ['favorites.ids']: data,
          });
      } else {
        await firestore()
          .collection(Collections.USER_CHALLENGE_CATEGORIES)
          .doc(userId)
          .update({
            ['favorites.ids']: data,
          });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  deleteChallengeFromFavorites = async ({
    challengeId,
    favoriteIds,
  }: {
    challengeId: string;
    favoriteIds: string[];
  }) => {
    try {
      const ids = favoriteIds;
      const newIds = ids.filter(id => {
        return id !== challengeId;
      });

      const favorites: FavoriteType = {
        ids: newIds,
      };

      await this.updateUserChallengeFavorites({
        data: newIds,
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
