import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {
  ChallengeCategoriesNames,
  ChallengeCategoryType,
  CurrentChallengeCategoryType,
  getNextChallengeCategory,
} from '@src/entities/ChallengeCategory';
import {ChallengeType} from '@src/entities/Challenge';
import {profileStore} from '@src/entities/Profile';
import {rubricFilterItemStore} from '@src/entities/RubricFilterItem';
import {userChallengeCategoryStore} from '@src/entities/UserChallengeCategory';

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
      this.isChallengePageLoading = true;
      // the order is important
      await profileStore.fetchProfile();
      await userChallengeCategoryStore.fetchUserChallengeCategory();
      await this.fetchChallengeCategories();
      await this.fetchChallenges();
    } catch (e) {
      console.log(e);
    } finally {
      runInAction(() => {
        this.isChallengePageLoading = false;
      });
    }
  };

  setChallengeCategory = (challengeCategory: CurrentChallengeCategoryType) => {
    try {
      runInAction(() => {
        this.challengeCategory = challengeCategory;
      });
    } catch (e) {
      console.log(e);
    }
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
        .get();

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
      console.log(e);
    }
  };

  fetchChallenges = async () => {
    try {
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
        .get();

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
      console.log(e);
    }
  };

  updateChallengeCategory = async ({id, name}: {id: string; name: string}) => {
    try {
      this.isChallengesLoading = true;

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
      console.log(e);
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
      console.log(e);
    }
  };

  filterChallenges = (name: string) => {
    try {
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
      console.log(e);
    }
  };

  clearChallengesInfo = () => {
    try {
      rubricFilterItemStore.clearInfo();
      this.filteredChallengesList = this.challenges;
    } catch (e) {
      console.log(e);
    }
  };

  checkIfAllChallengesSelected = async () => {
    try {
      const isAllChallengesSelected =
        this.challenges.length === this.selectedChallengesIds.length;

      if (isAllChallengesSelected) {
        const currentChallengeCategory = this.challengeCategory;
        if (!currentChallengeCategory) {
          return;
        }

        const nextChallengeCategoryName = getNextChallengeCategory(
          currentChallengeCategory.currentChallengeCategory as ChallengeCategoriesNames,
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

        this.setIsCongratsModalVisible(true);

        // fetching actual data after selecting all challenges
        await userChallengeCategoryStore.fetchUserChallengeCategory();
        await this.fetchChallengeCategories();
      }
    } catch (e) {
      console.log(e);
    }
  };
}

export default new ChallengesStore();
