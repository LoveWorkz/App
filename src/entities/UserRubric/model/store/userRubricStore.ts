import {makeAutoObservable, runInAction} from 'mobx';

import firestore from '@react-native-firebase/firestore';
import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {userRubricInitData} from '../lib/userRubric';
import {UserRubric} from '../types/userRubricType';

class UserRubricStore {
  userRubric: null | UserRubric = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchUserRubrics = async () => {
    try {
      const userId = userStore.authUserId;
      if (!userId) {
        return;
      }

      const data = await firestore()
        .collection(Collections.USER_RUBRICS)
        .doc(userId)
        .get();

      runInAction(() => {
        this.userRubric = data.data() as UserRubric;
      });
    } catch (e) {
      console.log(e);
    }
  };

  setUserRubric = async (userId: string) => {
    try {
      await firestore()
        .collection(Collections.USER_RUBRICS)
        .doc(userId)
        .set(userRubricInitData);
    } catch (e) {
      console.log(e);
    }
  };

  deleteUserRubric = async (userId: string) => {
    try {
      await firestore()
        .collection(Collections.USER_RUBRICS)
        .doc(userId)
        .delete();
    } catch (e) {
      console.log(e);
    }
  };
}

export default new UserRubricStore();
