import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {
  ChallengeCategoryType,
  CurrentChallengeCategoryType,
} from '@src/entities/ChallengeCategory';
import {ChallengeType, SpecialChallengeType} from '@src/entities/Challenge';
import {
  userChallengeCategoryStore,
  UserSpecialChallenge,
} from '@src/entities/UserChallengeCategory';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {challengeGroupStore} from '@src/entities/ChallengeGroup';

class ChallengesStore {
  challengeCategories: ChallengeCategoryType[] = [];
  challenges: ChallengeType[] = [];
  specialChallenges: SpecialChallengeType[] = [];
  selectedChallengesIds: string[] = [];
  favoriteChallengesList: ChallengeType[] = [];
  selectedSpecialChallengesIds: Record<string, UserSpecialChallenge> | null =
    null;
  isAllChallengesSelected: boolean = false;
  challengeCategory: null | CurrentChallengeCategoryType = null;
  isChallengesLoading: boolean = false;
  isChallengePageLoading: boolean = true;

  unlockedChallengeCategoriesIds: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  init = async () => {
    try {
      crashlytics().log('Fetching Challenges page.');

      runInAction(() => {
        this.isChallengePageLoading = true;
      });
      // the order is important
      await userStore.fetchUser();
      await this.fetchChallengeCategories();
      await this.fetchCoreAndSpecialChallenges();
      await challengeGroupStore.fetchCoreAndSpecialChallengesGroups();
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isChallengePageLoading = false;
      });
    }
  };

  setChallengeCategory = (challengeCategory: CurrentChallengeCategoryType) => {
    this.challengeCategory = challengeCategory;
  };

  setFavoriteChallengesList = (favoriteChallengesList: ChallengeType[]) => {
    this.favoriteChallengesList = favoriteChallengesList;
  };

  setSelectedChallengesIds = (selectedChallengesIds: string[]) => {
    this.selectedChallengesIds = selectedChallengesIds;
  };

  setsSelectedSpecialChallengesIds = (
    selectedSpecialChallengesIds: Record<string, UserSpecialChallenge>,
  ) => {
    this.selectedSpecialChallengesIds = selectedSpecialChallengesIds;
  };

  setIsAllChallengesSelected = (isAllChallengesSelected: boolean) => {
    this.isAllChallengesSelected = isAllChallengesSelected;
  };

  fetchChallengeCategories = async () => {
    try {
      crashlytics().log('Fetching Challenge Categories.');

      await userChallengeCategoryStore.fetchUserChallengeCategory();
      await this.mergeDefaultAndUserChallengeCategories();
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchDefaultChallengeCategories = async () => {
    try {
      crashlytics().log('Fetching default Challenge Categories.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const data = await firestore()
        .collection(Collections.CHALLENGE_CATEGORIES)
        .get({source});

      const challengeCategories = data.docs.map(challengeCategory => {
        return challengeCategory.data() as ChallengeCategoryType;
      });

      return challengeCategories;
    } catch (e) {
      errorHandler({error: e});
    }
  };

  mergeDefaultAndUserChallengeCategories = async () => {
    try {
      crashlytics().log('Merging default and user Challenge Categories.');

      const currentChallengeCategory = this.challengeCategory;
      if (!currentChallengeCategory) {
        return;
      }

      const challengeCategoryData =
        await this.fetchDefaultChallengeCategories();

      if (!challengeCategoryData) {
        return;
      }

      const userChallengeCategory =
        userChallengeCategoryStore.userChallengeCategory;
      if (!userChallengeCategory) {
        return;
      }

      // merge default challenge categories and user custom challenge categories together
      const challengeCategories = challengeCategoryData.map(
        challengeCategory => {
          return {
            ...challengeCategory,
            isBlocked:
              userChallengeCategory.challengeCategory[challengeCategory.name]
                .isBlocked,
            isActive:
              challengeCategory.name ===
              currentChallengeCategory.currentChallengeCategory,
          };
        },
      );

      const unlockedChallengeCategoriesIds = challengeCategories
        .filter(category => {
          // if this is All in one we should skip it
          if (category.id === 'challenge_category_1') {
            return false;
          }

          return !category.isBlocked;
        })
        .map(item => item.id);

      runInAction(() => {
        this.challengeCategories = challengeCategories;
        this.unlockedChallengeCategoriesIds = unlockedChallengeCategoriesIds;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchCoreAndSpecialChallenges = async () => {
    try {
      crashlytics().log('Fetching Core and Special Challenges.');

      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      let currentChallengeCategoryId =
        this.challengeCategory?.currentChallengeCategoryId;

      // if user has not selected some category set first one
      if (!currentChallengeCategoryId) {
        const firstChallengeCategory = this.challengeCategories[0];
        this.setChallengeCategory({
          currentChallengeCategory: firstChallengeCategory.name,
          currentChallengeCategoryId: firstChallengeCategory.id,
        });

        currentChallengeCategoryId = firstChallengeCategory.id;
      }

      const userChallengeCategory =
        userChallengeCategoryStore.userChallengeCategory;
      if (!userChallengeCategory) {
        return;
      }

      await this.fetchChallenges(currentChallengeCategoryId);
      await this.fetchSpecialChallenges(currentChallengeCategoryId);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchSpecialChallenges = async (categoryId: string) => {
    try {
      crashlytics().log('Fetching Special Challenges.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();
      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      const selectedSpecialChallengesIds = this.selectedSpecialChallengesIds;
      if (!selectedSpecialChallengesIds) {
        return;
      }

      const data = await firestore()
        .collection(Collections.SPECIAL_CHALLENGES)
        .get({source});

      const specialChallenges = data.docs.map(doc => {
        const specialChallenge = doc.data() as SpecialChallengeType;
        const description =
          specialChallenge.multiDescription.part1 ||
          specialChallenge.description;

        return {
          ...specialChallenge,
          description,
          ...selectedSpecialChallengesIds[specialChallenge.id],
        };
      });

      runInAction(() => {
        this.specialChallenges = specialChallenges;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchChallenges = async (categoryId: string) => {
    try {
      crashlytics().log('Fetching Challenges.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const challengesData = await firestore()
        .collection(Collections.CORE_CHALLENGES)
        .get({source});

      // merge default challenges and user custom challenges together
      const challenges = challengesData.docs.map((doc, i) => {
        const challenge = doc.data() as ChallengeType;

        return {
          ...challenge,
          isChecked: this.selectedChallengesIds.includes(challenge.id),
        };
      });

      runInAction(() => {
        this.challenges = challenges;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  selectChallengeCategory = async ({id, name}: {id: string; name: string}) => {
    try {
      crashlytics().log('Selecting challenge category.');

      runInAction(() => {
        this.isChallengesLoading = true;
      });

      const newChallengeCategory = {
        currentChallengeCategory: name,
        currentChallengeCategoryId: id,
      };

      await userStore.updateUser({
        field: 'challengeCategory',
        data: newChallengeCategory,
      });

      runInAction(() => {
        this.setChallengeCategory(newChallengeCategory);
        this.updateLocalChallengeCategory({id});
      });
      // calling fetchUserChallengeCategory for refresing selectedChallengesIds
      await userChallengeCategoryStore.fetchUserChallengeCategory();
      // fetchig challenges for new challengeCategory
      await this.fetchCoreAndSpecialChallenges();
      await challengeGroupStore.fetchCoreAndSpecialChallengesGroups(id);
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isChallengesLoading = false;
      });
    }
  };

  updateLocalChallengeCategory = ({id}: {id: string}) => {
    try {
      runInAction(() => {
        this.challengeCategories = this.challengeCategories.map(item => {
          if (item.id === id) {
            return {...item, isActive: true};
          }

          return {...item, isActive: false};
        });
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  toggleChallengeCategoryPurchasedStatus = async (isBlocked: boolean) => {
    try {
      const promises: Promise<void>[] = [];

      this.challengeCategories.map(challangeCategory => {
        const promise = userChallengeCategoryStore.updateUserChallengeCategory({
          challengeCategoryName: challangeCategory.name,
          field: 'isBlocked',
          data: isBlocked,
        });

        promises.push(promise);
      });

      Promise.all(promises);
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new ChallengesStore();
