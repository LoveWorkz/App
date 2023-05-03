import {makeAutoObservable} from 'mobx';

import firestore from '@react-native-firebase/firestore';
import {Collections} from '@src/shared/types/firebase';
import {userRubricInitData} from '../lib/userRubric';

class UserRubricStore {
  constructor() {
    makeAutoObservable(this);
  }

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
