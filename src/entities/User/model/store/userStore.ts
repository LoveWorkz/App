import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';

import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigate} from '@src/shared/config/navigation/navigation';
import {DeleteAccountStore} from '@src/features/DeleteAccount';
import {User, InitlUserInfo, AuthMethod} from '../types/userSchema';
import {userFormatter} from '../../lib/userForamtter';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {AUTH_METHOD_STORAGE_KEY} from '@src/shared/consts/storage';

class UserStore {
  authUser: null | User = null;
  authMethod: AuthMethod = AuthMethod.AUTH_BY_EMAIL;

  constructor() {
    makeAutoObservable(this);
  }

  setAuthMethod = async (authMethod: AuthMethod) => {
    this.authMethod = authMethod;
  };

  initAuthUser = async () => {
    try {
      await auth().currentUser?.reload();
      const user = auth().currentUser;

      if (user) {
        const formattedUser = userFormatter(user as InitlUserInfo);
        this.authUser = formattedUser;

        const value = await authStorage.getAuthData(AUTH_METHOD_STORAGE_KEY);
        if (value) {
          this.setAuthMethod(value as AuthMethod);
        }

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
      await DeleteAccountStore.clearUserInfo();

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
}

export default new UserStore();
