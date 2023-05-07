import {makeAutoObservable, runInAction} from 'mobx';

import firestore from '@react-native-firebase/firestore';
import {Collections} from '@src/shared/types/firebase';
import {userCategoryInitData} from '../lib/userCategory';
import {userStore} from '@src/entities/User';
import {UserCategory} from '../types/userCategoryType';

class UserCategoryStore {
  userCategory: null | UserCategory = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchUserCategories = async () => {
    try {
      const userId = userStore.authUserId;
      if (!userId) {
        return;
      }

      const data = await firestore()
        .collection(Collections.USER_CATEGORIES)
        .doc(userId)
        .get();

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
