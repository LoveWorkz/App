import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {Collections} from '@src/shared/types/types';
import {userStore} from '@src/entities/User';
import {Profile} from '../types/profileSchema';

class ProfileStore {
  profileData: null | Profile = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchProfile = async () => {
    const userId = userStore.authUser?.id;

    try {
      if (userId) {
        const authUser = await firestore()
          .collection(Collections.USERS)
          .doc(userId)
          .get();

        runInAction(() => {
          this.profileData = authUser.data() as Profile;
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
}

export default new ProfileStore();
