import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {userStore} from '@src/entities/User';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {
  AUTH_METHOD_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from '@src/shared/consts/storage';
import {Collections} from '@src/shared/types/types';
import {navigate} from '@src/shared/config/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {profileStore} from '@src/entities/Profile';

class DeleteAccountStore {
  constructor() {
    makeAutoObservable(this);
  }

  deleteUserAccount = async () => {
    try {
      const currentUser = auth().currentUser;

      if (currentUser) {
        await currentUser.delete();
        await this.clearUserInfo();

        navigate(AppRouteNames.AUTH);
      }
    } catch (e) {
      console.log(e);
    }
  };

  clearUserInfo = async () => {
    const value = await authStorage.getAuthData(AUTH_USER_STORAGE_KEY);
    const userFromStorage = JSON.parse(value || '');

    userStore.setAuthUser(null);
    await firestore()
      .collection(Collections.USERS)
      .doc(userFromStorage.id)
      .delete();

    profileStore.setProfileData(null);
    await authStorage.removeAuthData(AUTH_USER_STORAGE_KEY);
    await authStorage.removeAuthData(AUTH_METHOD_STORAGE_KEY);
  };
}

export default new DeleteAccountStore();
