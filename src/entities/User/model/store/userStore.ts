import {makeAutoObservable} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {User, InitlUserInfo} from '../types/userSchema';
import {
  AUTH_METHOD_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from '@src/shared/consts/storage';
import {Collections} from '@src/shared/types/types';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigate} from '@src/shared/config/navigation/navigation';
import {userFormatter} from '../../lib/userForamtter';

class UserStore {
  authUser: null | User = null;

  constructor() {
    makeAutoObservable(this);
  }

  initAuthUser = async () => {
    try {
      await auth().currentUser?.reload();
      const user = auth().currentUser;

      if (user) {
        const formattedUser = userFormatter(user as InitlUserInfo);
        this.authUser = formattedUser;

        await firestore()
          .collection(Collections.USERS)
          .doc(formattedUser.id)
          .update({
            ...formattedUser,
          });

        navigate(AppRouteNames.MAIN);
      } else {
        navigate(AppRouteNames.AUTH);
      }
    } catch (e: unknown) {
      this.errorHandler(e);
    }
  };

  errorHandler = async (e: unknown) => {
    if (!(e instanceof Error)) {
      return;
    }

    if (e.message.includes('auth/user-not-found')) {
      await this.deleteAuthUser();

      navigate(AppRouteNames.AUTH);
    }
  };

  setAuthUser(user: User | null) {
    this.authUser = user;
  }

  verifyEmail = async () => {
    try {
      await auth().currentUser?.sendEmailVerification();
      await auth().currentUser?.reload();
    } catch (e) {
      // too many request error
      console.log(e);
    }
  };

  deleteAuthUser = async () => {
    const value = await authStorage.getAuthData(AUTH_USER_STORAGE_KEY);
    const userFromStorage = JSON.parse(value || '');

    this.authUser = null;
    await firestore()
      .collection(Collections.USERS)
      .doc(userFromStorage.id)
      .delete();

    await authStorage.removeAuthData(AUTH_USER_STORAGE_KEY);
    await authStorage.removeAuthData(AUTH_METHOD_STORAGE_KEY);
  };
}

export default new UserStore();
