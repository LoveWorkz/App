import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {
  ChallengeCategoryType,
  CurrentChallengeCategoryType,
} from '@src/entities/ChallengeCategory';
import {
  ChallengeType,
  SpecialChallengeType,
  TrendingChallengeType,
} from '@src/entities/Challenge';
import {userChallengeCategoryStore} from '@src/entities/UserChallengeCategory';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {
  challengeGroupStore,
  ChallengeGroupType,
} from '@src/entities/ChallengeGroup';
import {CategoryKey} from '@src/entities/Category';

class ChallengesStore {
  challengeCategories: ChallengeCategoryType[] = [];
  challenges: ChallengeType[] = [];
  specialChallenges: SpecialChallengeType[] = [];
  selectedChallengesIds: string[] = [];
  favoriteChallengesList: ChallengeType[] = [];
  selectedSpecialChallengesIds: string[] = [];
  isAllChallengesSelected: boolean = false;
  challengeCategory: null | CurrentChallengeCategoryType = null;
  isChallengesLoading: boolean = false;
  isChallengePageLoading: boolean = true;
  challengeTabIndex: number = 0;
  trendingChallenges: TrendingChallengeType[] = [];

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

  setChallengeTabIndex = (challengeTabIndex: number) => {
    this.challengeTabIndex = challengeTabIndex;
  };

  setFavoriteChallengesList = (favoriteChallengesList: ChallengeType[]) => {
    this.favoriteChallengesList = favoriteChallengesList;
  };

  setSelectedChallengesIds = (selectedChallengesIds: string[]) => {
    this.selectedChallengesIds = selectedChallengesIds;
  };

  setSelectedSpecialChallengesIds = (
    selectedSpecialChallengesIds: string[],
  ) => {
    this.selectedSpecialChallengesIds = selectedSpecialChallengesIds;
  };

  setIsAllChallengesSelected = (isAllChallengesSelected: boolean) => {
    this.isAllChallengesSelected = isAllChallengesSelected;
  };

  setTrendingChallenges = (trendingChallenges: TrendingChallengeType[]) => {
    this.trendingChallenges = trendingChallenges;
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

      // if user has not selected some category set category Starter one
      if (!currentChallengeCategoryId) {
        const firstChallengeCategory = this.challengeCategories.find(
          item => item.name === CategoryKey.Starter,
        );
        if (!firstChallengeCategory) {
          return;
        }

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

      await this.fetchChallenges();
      await this.fetchSpecialChallenges();
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchSpecialChallenges = async () => {
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
        .collection(Collections.SPECIAL_CHALLENGES_2)
        .get({source});

      const specialChallenges = data.docs.map(doc => {
        const specialChallenge = doc.data() as SpecialChallengeType;

        return {
          ...specialChallenge,
          isChecked: selectedSpecialChallengesIds.includes(specialChallenge.id),
        };
      });

      runInAction(() => {
        this.specialChallenges = specialChallenges;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchChallenges = async () => {
    try {
      crashlytics().log('Fetching Challenges.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const challengesData = await firestore()
        // TODO: here core challenges translations
        .collection(Collections.CORE_CHALLENGES_NEW)
        .get({source});

      // merge default challenges and user custom challenges together
      const challenges = challengesData.docs.map((doc, _i) => {
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

  /**
   * Fetches and maps top trending challenges to their corresponding groups,
   * handling both core and special categories.
   */
  fetchCoreAndSpecialTrendingChallenges = async () => {
    try {
      this.fetchChallengeCategories;

      // Fetch top 3 trending challenges for both core and special
      const [coreChallenges, specialChallenges] = await Promise.all([
        this.fetchTrendingChallenges({
          collectionName: Collections.CORE_CHALLENGES_NEW,
        }),
        this.fetchTrendingChallenges({
          collectionName: Collections.SPECIAL_CHALLENGES_2,
        }),
      ]);

      const combinedChallenges = [...coreChallenges, ...specialChallenges];

      // Sort the combined array by totalViews in descending order and take the top 3
      const topTrendingChallenges = combinedChallenges
        .sort((a, b) => b.totalViews - a.totalViews)
        .slice(0, 3);

      const groupIds = [
        ...new Set(topTrendingChallenges.map(challenge => challenge.groupId)),
      ];

      // Fetch groups from both core and special groups collection
      const [coreGroups, specialGroups] = await Promise.all([
        challengeGroupStore.fetchGroupsByIds({
          groupIds,
          collectionName: Collections.CORE_CHALLENGE_GROUPS,
        }),
        challengeGroupStore.fetchGroupsByIds({
          groupIds,
          collectionName: Collections.SPECIAL_CHALLENGE_GROUPS,
          isCore: false,
        }),
      ]);

      if (!(coreGroups.length && specialGroups.length)) {
        return;
      }

      const groupMap = [...coreGroups, ...specialGroups].reduce(
        (acc, group) => {
          acc[group.id] = group;
          return acc;
        },
        {} as Record<
          string,
          ChallengeGroupType<ChallengeType[] | SpecialChallengeType[]>
        >,
      );

      const topTrendingChallengesWithGroups = topTrendingChallenges.map(
        challenge => ({
          ...challenge,
          group: groupMap[challenge.groupId] || null,
        }),
      ) as TrendingChallengeType[];

      this.setTrendingChallenges(topTrendingChallengesWithGroups);
    } catch (e) {
      errorHandler({
        error: e,
        message: 'Failed to fetch and map challenges with groups',
      });
    }
  };

  fetchTrendingChallenges = async ({
    collectionName,
  }: {
    collectionName: Collections;
  }) => {
    const source = await userStore.checkIsUserOfflineAndReturnSource();

    const snapshot = await firestore()
      .collection(collectionName)
      .orderBy('totalViews', 'desc')
      .limit(3)
      .get({source});

    const trendingChallenges = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ChallengeType[] | SpecialChallengeType[];

    return trendingChallenges;
  };
}

export default new ChallengesStore();
