import {makeAutoObservable} from 'mobx';

import firestore from '@react-native-firebase/firestore';
import {Collections} from '@src/shared/types/firebase';
import {userChallengeCategoryInitData} from '../lib/userChallengeCategory';

class UserChallengeCategoryStore {
  constructor() {
    makeAutoObservable(this);
  }

  setUserChallengeCategory = async (userId: string) => {
    try {
      await firestore()
        .collection(Collections.USER_CHALLENGE_CATEGORIES)
        .doc(userId)
        .set(userChallengeCategoryInitData);
    } catch (e) {
      console.log(e);
    }
  };

  deleteUserChallengeCategory = async (userId: string) => {
    try {
      await firestore()
        .collection(Collections.USER_CHALLENGE_CATEGORIES)
        .doc(userId)
        .delete();
    } catch (e) {
      console.log(e);
    }
  };
}

export default new UserChallengeCategoryStore();
