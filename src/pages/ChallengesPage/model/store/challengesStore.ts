import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {
  ChallengeCategoryKeys,
  ChallengeCategoryType,
  CurrentChallengeCategoryType,
  getNextChallengeCategory,
} from '@src/entities/ChallengeCategory';
import {ChallengeType} from '@src/entities/Challenge';
import {profileStore} from '@src/entities/Profile';
import {rubricFilterItemStore} from '@src/entities/RubricFilterItem';
import {userChallengeCategoryStore} from '@src/entities/UserChallengeCategory';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';

class ChallengesStore {
  challengeCategories: ChallengeCategoryType[] = [];
  challenges: ChallengeType[] = [];
  filteredChallengesList: ChallengeType[] = [];
  selectedChallengesIds: string[] = [];
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

      this.isChallengePageLoading = true;
      // the order is important
      await profileStore.fetchProfile();
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
      await this.fetchDefaultChallengeCategories();
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchDefaultChallengeCategories = async () => {
    try {
      crashlytics().log('Fetching default Challenge Categories.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const currentChallengeCategory = this.challengeCategory;
      const userId = userStore.authUserId;
      if (!userId) {
        return;
      }
      if (!currentChallengeCategory) {
        return;
      }

      const challengeCategoryData = await firestore()
        .collection(Collections.CHALLENGE_CATEGORIES)
        .orderBy('createdDate')
        .get({source});

      const userChallengeCategory =
        userChallengeCategoryStore.userChallengeCategory;

      if (!userChallengeCategory) {
        return;
      }

      // merge default challenge categories and user custom challenge categories together
      const challengeCategories = challengeCategoryData.docs.map(doc => {
        const data = doc.data() as ChallengeCategoryType;
        return {
          ...data,
          isBlocked:
            userChallengeCategory.challengeCategory[data.name].isBlocked,
          isActive:
            data.name === currentChallengeCategory.currentChallengeCategory,
        };
      });

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

      const currentChallengeCategory = this.challengeCategory;
      const userId = userStore.authUserId;
      if (!userId) {
        return;
      }
      if (!currentChallengeCategory) {
        return;
      }

      const challengesData = await firestore()
        .collection(Collections.CHALLENGE_CATEGORIES)
        .doc(currentChallengeCategory.currentChallengeCategoryId)
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

      runInAction(() => {
        this.challenges = challenges;
        this.filteredChallengesList = challenges;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  selectChallengeCategory = async ({id, name}: {id: string; name: string}) => {
    try {
      crashlytics().log('Selecting challenge category.');

      // return if user pressed already chosen challenge category
      if (this.challengeCategory?.currentChallengeCategoryId === id) {
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

      rubricFilterItemStore.toggleRubricStatus({name});

      if (rubricFilterItemStore.rubricskeys.includes(name)) {
        this.filteredChallengesList = rubricFilterItemStore.turnOffFilterByKey({
          key: name,
          list: this.challenges,
        }) as ChallengeType[];
      } else {
        this.filteredChallengesList = rubricFilterItemStore.filterByKey({
          key: name,
          list: this.filteredChallengesList,
        });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  clearChallengesInfo = () => {
    rubricFilterItemStore.clearInfo();
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
          currentChallengeCategory.currentChallengeCategory as ChallengeCategoryKeys,
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
}

export default new ChallengesStore();
