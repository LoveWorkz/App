import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {
  ChallengeCategoriesNames,
  ChallengeCategoryType,
  CurrentChallengeCategoryType,
  UserChallengeCategoryType,
} from '@src/entities/ChallengeCategory';
import {ChallengeType} from '@src/entities/Challenge';
import {profileStore} from '@src/entities/Profile';
import {rubricFilterItemStore} from '@src/entities/RubricFilterItem';

class ChallengesStore {
  challengeCategories: ChallengeCategoryType[] = [];
  challenges: ChallengeType[] = [];
  filteredChallengesList: ChallengeType[] = [];
  isChallengeCategoriesLoading: boolean = true;
  isChallengesLoading: boolean = true;
  selectedChallengesIds: string[] = [];
  userChallengeCategory: null | UserChallengeCategoryType = null;
  challengeCategory: null | CurrentChallengeCategoryType = null;

  constructor() {
    makeAutoObservable(this);
  }

  init = async () => {
    // the order is important
    await profileStore.fetchProfile();
    await this.fetchUserChallengeCategory();
    await this.fetchChallengeCategories();
    await this.fetchChallenges();
  };

  setSelectedChallengesIds = (selectedChallengesIds: string[]) => {
    this.selectedChallengesIds = selectedChallengesIds;
  };

  fetchUserChallengeCategory = async () => {
    try {
      const currentChallengeCategory = this.challengeCategory;
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
        .get();
      const userChallengeCategory =
        userChallengeCategoryData.data() as UserChallengeCategoryType;

      if (!userChallengeCategory) {
        return;
      }

      runInAction(() => {
        this.userChallengeCategory = userChallengeCategory;
        // keeping selected Challenges Ids separately for updating challenges
        this.setSelectedChallengesIds(
          userChallengeCategory.challengeCategory[
            currentChallengeCategory.currentChallengeCategory as ChallengeCategoriesNames
          ].selectedChallengesIds,
        );
      });
    } catch (e) {
      console.log(e);
    }
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

      const userChallengeCategory = this.userChallengeCategory;

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
    } finally {
      runInAction(() => {
        this.isChallengeCategoriesLoading = false;
      });
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
        .get();

      const userChallengeCategory = this.userChallengeCategory;

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
    } finally {
      runInAction(() => {
        this.isChallengesLoading = false;
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

  updateChallengeCategory = async ({id, name}: {id: string; name: string}) => {
    try {
      this.isChallengesLoading = true;
      this.isChallengeCategoriesLoading = true;

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
      await this.fetchUserChallengeCategory();
      // fetchig challenges for new challengeCategory
      await this.fetchChallenges();
    } catch (e) {
      console.log(e);
    } finally {
      runInAction(() => {
        this.isChallengesLoading = false;
        this.isChallengeCategoriesLoading = false;
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
    rubricFilterItemStore.clearInfo();
    this.filteredChallengesList = this.challenges;
  };
}

export default new ChallengesStore();
