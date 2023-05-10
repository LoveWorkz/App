import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {userCategoryInitData} from '../lib/userCategory';
import {UserCategory} from '../types/userCategoryType';

class UserCategoryStore {
  userCategory: null | UserCategory = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchUserCategories = async () => {
    try {
      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const userId = userStore.authUserId;
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
      console.log(e);
    }
  };

  setUserCategory = async (userId: string) => {
    try {
      await firestore()
        .collection(Collections.USER_CATEGORIES)
        .doc(userId)
        .set(userCategoryInitData);
    } catch (e) {
      console.log(e);
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
      const isOffline = await userStore.getIsUserOffline();
      const userId = userStore.authUserId;
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
      console.log(e);
    }
  };

  deleteUserCategory = async (userId: string) => {
    try {
      await firestore()
        .collection(Collections.USER_CATEGORIES)
        .doc(userId)
        .delete();
    } catch (e) {
      console.log(e);
    }
  };
}

export default new UserCategoryStore();
