import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';

import {userStore} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {Collections} from '@src/shared/types/firebase';
import {onboardingStorage} from '@src/shared/lib/storage/adapters/onboardingAdapter';
import {SELECTED_GOALS_KEY} from '@src/shared/consts/storage';
import {GoalType} from '../types/goalTypes';

class GoalStore {
  goals: GoalType[] = [];
  isFetching: boolean = true;
  selectedGoalsIds: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  initSelectedGoalsIds = async () => {
    try {
      crashlytics().log('Init selected goals Ids.');

      const user = userStore.user;
      if (!user) {
        return;
      }

      let selectedGoalsIds = user.selectedGoalsIds;

      const valueFromStorage = await onboardingStorage.getOnboardingData(
        SELECTED_GOALS_KEY,
      );

      // If a user has selected some goals during the onboarding process, add them to the database
      if (valueFromStorage) {
        selectedGoalsIds = JSON.parse(valueFromStorage);
        await this.updateUserSelectedGoalIds(selectedGoalsIds);
        await onboardingStorage.removeOnboardingData(SELECTED_GOALS_KEY);

        return;
      }

      this.setSelectedGoalIds(selectedGoalsIds);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  init = async () => {
    try {
      crashlytics().log('Init goals.');

      this.setIsFetching(true);

      const selectedGoalsIds = this.selectedGoalsIds;

      await this.fetchGoals(selectedGoalsIds);

      // If it's onboarding process, selected goals IDs should not be saved
      const valueFromStorage = await onboardingStorage.getOnboardingData(
        SELECTED_GOALS_KEY,
      );
      if (valueFromStorage) {
        await onboardingStorage.removeOnboardingData(SELECTED_GOALS_KEY);
      }
    } catch (e) {
      errorHandler({error: e});
    } finally {
      this.setIsFetching(false);
    }
  };

  setIsFetching = (isFetching: boolean) => {
    this.isFetching = isFetching;
  };

  setSelectedGoalIds = (selectedGoalsIds: string[]) => {
    this.selectedGoalsIds = selectedGoalsIds;
  };

  fetchGoals = async (selectedGoalsIds: string[]) => {
    try {
      crashlytics().log('Fetching goals.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const data = await firestore()
        .collection(Collections.GOALS)
        .orderBy('goalNumber')
        .get({source});

      const goals = data.docs.map(goal => {
        return {
          ...goal.data(),
          isSelected: selectedGoalsIds.includes(goal.id),
        } as GoalType;
      });

      runInAction(() => {
        this.goals = goals;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  toggleGoalStatus = async (id: string) => {
    try {
      const selectedGoalsIds = this.selectedGoalsIds;
      let newSelectedGoalsIds = selectedGoalsIds;

      if (selectedGoalsIds.includes(id)) {
        newSelectedGoalsIds = selectedGoalsIds.filter(goal => goal !== id);
      } else {
        newSelectedGoalsIds = [...selectedGoalsIds, id];
      }

      // BLINE-312: User can select up to 5 goals
      if (newSelectedGoalsIds.length > 5) {
        return;
      }

      this.updateGoalStatus(id);
      await this.updateSelectedGoalIds(newSelectedGoalsIds);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateGoalStatus = (id: string) => {
    const updatedGoals = this.goals.map(goal => {
      if (goal.id === id) {
        return {...goal, isSelected: !goal.isSelected};
      }

      return goal;
    });

    runInAction(() => {
      this.goals = updatedGoals;
    });
  };

  updateSelectedGoalIds = async (newSelectedGoalsIds: string[]) => {
    const user = userStore.user;

    if (user) {
      await this.updateUserSelectedGoalIds(newSelectedGoalsIds);
      return;
    }

    await onboardingStorage.setOnboardingData(
      SELECTED_GOALS_KEY,
      JSON.stringify(newSelectedGoalsIds),
    );
    this.setSelectedGoalIds(newSelectedGoalsIds);
  };

  updateUserSelectedGoalIds = async (newSelectedGoalsIds: string[]) => {
    await userStore.updateUser({
      field: 'selectedGoalsIds',
      data: newSelectedGoalsIds,
    });

    this.setSelectedGoalIds(newSelectedGoalsIds);
  };
}

export default new GoalStore();
