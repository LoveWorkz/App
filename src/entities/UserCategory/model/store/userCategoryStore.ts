import {makeAutoObservable} from 'mobx';

import firestore from '@react-native-firebase/firestore';
import {Collections} from '@src/shared/types/firebase';
import {userCategoryInitData} from '../lib/userCategory';

class UserCategoryStore {
  constructor() {
    makeAutoObservable(this);
  }

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
