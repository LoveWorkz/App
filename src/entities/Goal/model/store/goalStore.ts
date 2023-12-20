import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';

import {userStore} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {Collections} from '@src/shared/types/firebase';
import {GoalType} from '../types/goalTypes';

class GoalStore {
  goals: GoalType[] = [];
  isFetching: boolean = true;
  selectedGoalsIds: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setIsFetching = (isFetching: boolean) => {
    this.isFetching = isFetching;
  };

  setSelectedGoalIds = (selectedGoalsIds: string[]) => {
    this.selectedGoalsIds = selectedGoalsIds;
  };

  fetchGoals = async () => {
    try {
      crashlytics().log('Fetching goals.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      this.setIsFetching(true);

      const selectedGoalsIds = this.selectedGoalsIds;

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
    } finally {
      this.setIsFetching(false);
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
    await userStore.updateUser({
      field: 'selectedGoalsIds',
      data: newSelectedGoalsIds,
    });

    this.setSelectedGoalIds(newSelectedGoalsIds);
  };
}

export default new GoalStore();
