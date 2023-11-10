import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {CategoryType} from '@src/entities/Category';
import {getUserCategoryInitData} from '../lib/userCategory';
import {UserCategory} from '../types/userCategoryType';

class UserCategoryStore {
  userCategory: null | UserCategory = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchUserCategories = async () => {
    try {
      crashlytics().log('Fetching User Category.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      const data = await firestore()
        .collection(Collections.USER_CATEGORIES)
        .doc(userId)
        .get({source});

      runInAction(() => {
        this.userCategory = data.data() as UserCategory;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setUserCategory = async (userId: string) => {
    try {
      crashlytics().log('Setting User Category.');

      const defaultCategories = await categoriesStore.fetchDefaultCategories();
      if (!defaultCategories) {
        return;
      }

      const userCategories: Record<string, Partial<CategoryType>> = {};

      defaultCategories.forEach(category => {
        const categoryId = category.id;

        userCategories[categoryId] = {
          ...getUserCategoryInitData(category.name),
        };
      });

      await firestore()
        .collection(Collections.USER_CATEGORIES)
        .doc(userId)
        .set({categories: userCategories});
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateUserCategory = async ({
    field,
    id,
    data,
  }: {
    id: string;
    field: string;
    data: number | string | boolean;
  }) => {
    try {
      crashlytics().log('Updating User Category.');

      const isOffline = await userStore.getIsUserOffline();
      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      if (isOffline) {
        firestore()
          .collection(Collections.USER_CATEGORIES)
          .doc(userId)
          .update({
            [`categories.${id}.${field}`]: data,
          });
      } else {
        await firestore()
          .collection(Collections.USER_CATEGORIES)
          .doc(userId)
          .update({
            [`categories.${id}.${field}`]: data,
          });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  deleteUserCategory = async (userId: string) => {
    try {
      crashlytics().log('Deleting User Category.');

      await firestore()
        .collection(Collections.USER_CATEGORIES)
        .doc(userId)
        .delete();
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new UserCategoryStore();
