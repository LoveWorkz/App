import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {RubricType} from '@src/entities/Rubric';
import {userRubricInitData} from '../lib/userRubric';
import {UserRubric} from '../types/userRubricType';

class UserRubricStore {
  userRubric: null | UserRubric = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchUserRubrics = async () => {
    try {
      crashlytics().log('Fetching User Rubrics.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();
      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      const data = await firestore()
        .collection(Collections.USER_RUBRICS)
        .doc(userId)
        .get({source});

      runInAction(() => {
        this.userRubric = data.data() as UserRubric;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setUserRubric = async (userId: string) => {
    try {
      crashlytics().log('Setting User Rubrics.');

      const defaultRubrics = await categoriesStore.fetchDefaultRubrics();
      if (!defaultRubrics) {
        return;
      }

      const userRubrics: Record<string, Partial<RubricType>> = {};

      defaultRubrics.forEach(rubric => {
        userRubrics[rubric.id] = {
          ...userRubricInitData,
        };
      });

      await firestore()
        .collection(Collections.USER_RUBRICS)
        .doc(userId)
        .set({rubrics: userRubrics});
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateUserRubric = async ({
    id,
    field,
    data,
  }: {
    id: string;
    field: string;
    data: number | string;
  }) => {
    try {
      crashlytics().log('Updating User Rubric.');

      const isOffline = await userStore.getIsUserOffline();
      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      if (isOffline) {
        firestore()
          .collection(Collections.USER_RUBRICS)
          .doc(userId)
          .update({
            [`rubrics.${id}.${field}`]: data,
          });
      } else {
        await firestore()
          .collection(Collections.USER_RUBRICS)
          .doc(userId)
          .update({
            [`rubrics.${id}.${field}`]: data,
          });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  deleteUserRubric = async (userId: string) => {
    try {
      crashlytics().log('Deleting User Rubric.');

      await firestore()
        .collection(Collections.USER_RUBRICS)
        .doc(userId)
        .delete();
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new UserRubricStore();
