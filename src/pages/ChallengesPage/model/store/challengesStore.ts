import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {
  ChallengeCategoryType,
  CurrentChallengeCategoryType,
  getNextChallengeCategory,
} from '@src/entities/ChallengeCategory';
import {
  ChallengeType,
  specialChallengesList,
  SpecialChallengeType,
} from '@src/entities/Challenge';
import {rubricFilterItemStore} from '@src/entities/RubricFilterItem';
import {
  userChallengeCategoryStore,
  UserSpecialChallenge,
} from '@src/entities/UserChallengeCategory';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {CategoryKey} from '@src/entities/Category';

class ChallengesStore {
  challengeCategories: ChallengeCategoryType[] = [];
  challenges: ChallengeType[] = [];
  specialChallenges: SpecialChallengeType[] = [];
  filteredChallengesList: ChallengeType[] = [];
  selectedChallengesIds: string[] = [];
  selectedSpecialChallengesIds: Record<string, UserSpecialChallenge> | null =
    null;
  isAllChallengesSelected: boolean = false;
  challengeCategory: null | CurrentChallengeCategoryType = null;
  isCongratsModalVisible: boolean = false;
  isChallengesLoading: boolean = false;
  isChallengePageLoading: boolean = true;

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
      await this.fetchChallenges();
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

  setIsCongratsModalVisible = (isCongratsModalVisible: boolean) => {
    this.isCongratsModalVisible = isCongratsModalVisible;
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
        .orderBy('createdDate')
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

      runInAction(() => {
        this.challengeCategories = challengeCategories;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchChallenges = async () => {
    try {
      crashlytics().log('Fetching Challenges.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();
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

      const challengesData = await firestore()
        .collection(Collections.CHALLENGE_CATEGORIES)
        .doc(currentChallengeCategoryId)
        .collection(Collections.CHALLENGES)
        .orderBy('createdDate')
        .get({source});

      const userChallengeCategory =
        userChallengeCategoryStore.userChallengeCategory;

      if (!userChallengeCategory) {
        return;
      }

      // merge default challenges and user custom challenges together
      const challenges = challengesData.docs.map((doc, i) => {
        const challenge = doc.data() as ChallengeType;

        return {
          ...challenge,
          isChecked: this.selectedChallengesIds.includes(challenge.id),
          nomer: `${i + 1}`,
        };
      });

      const selectedSpecialChallengesIds = this.selectedSpecialChallengesIds;
      if (!selectedSpecialChallengesIds) {
        return;
      }

      const specialChallenges = specialChallengesList.map(specialChallenge => {
        return {
          ...specialChallenge,
          ...selectedSpecialChallengesIds[specialChallenge.id],
        };
      });

      runInAction(() => {
        this.challenges = challenges;
        this.filteredChallengesList = challenges;
        this.specialChallenges = specialChallenges;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  selectChallengeCategory = async ({id, name}: {id: string; name: string}) => {
    try {
      crashlytics().log('Selecting challenge category.');

      let currentChallengeCategoryId =
        this.challengeCategory?.currentChallengeCategoryId;

      // return if user pressed already chosen challenge category
      if (currentChallengeCategoryId === id) {
        return;
      }

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

      // reset filter
      this.clearChallengesInfo();

      runInAction(() => {
        this.setChallengeCategory(newChallengeCategory);
        this.updateLocalChallengeCategory({id});
      });
      // calling fetchUserChallengeCategory for refresing selectedChallengesIds
      await userChallengeCategoryStore.fetchUserChallengeCategory();
      // fetchig challenges for new challengeCategory
      await this.fetchChallenges();
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

  filterChallenges = (name: string) => {
    try {
      crashlytics().log('Filtering challenges.');

      this.filteredChallengesList = rubricFilterItemStore.startFilterLogic({
        list: this.challenges,
        key: name,
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  clearChallengesInfo = () => {
    rubricFilterItemStore.clearFilteredInfo();
    this.filteredChallengesList = this.challenges;
  };

  checkIfAllChallengesSelected = async () => {
    try {
      crashlytics().log('Checking if all challenges selected.');

      const isAllChallengesSelected =
        this.challenges.length === this.selectedChallengesIds.length;

      if (isAllChallengesSelected) {
        const currentChallengeCategory = this.challengeCategory;
        if (!currentChallengeCategory) {
          return;
        }

        const nextChallengeCategoryName = getNextChallengeCategory(
          currentChallengeCategory.currentChallengeCategory as CategoryKey,
        );

        if (this.isAllChallengesSelected) {
          return;
        }

        // update data after selecting all challenges
        await userChallengeCategoryStore.updateUserChallengeCategory({
          field: 'isAllChallengesSelected',
          data: true,
        });
        this.setIsAllChallengesSelected(true);
        // open next challenge category
        await userChallengeCategoryStore.updateUserChallengeCategory({
          field: 'isBlocked',
          challengeCategoryName: nextChallengeCategoryName,
          data: false,
        });

        crashlytics().log('User selected all challenges.');

        this.setIsCongratsModalVisible(true);

        // fetching actual data after selecting all challenges
        await this.fetchChallengeCategories();
      }
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
