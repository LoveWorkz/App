import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

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

  setAuthUser(user: User | null) {
    this.authUser = user;
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

  reauthenticate = async ({
    email,
    password,
    erorHandler,
  }: {
    email?: string;
    password?: string;
    erorHandler?: (e: unknown) => void;
  }) => {
    try {
      const isAuthMethodEmail = this.authMethod === AuthMethod.AUTH_BY_EMAIL;
      let credential;

      if (isAuthMethodEmail) {
        if (email && password) {
          credential = auth.EmailAuthProvider.credential(email, password);
        }
      } else {
        const tokens = await GoogleSignin.getTokens();
        credential = auth.GoogleAuthProvider.credential(tokens.idToken);
      }

      const currentUser = auth().currentUser;
      credential &&
        (await currentUser?.reauthenticateWithCredential(credential));
      return true;
    } catch (e) {
      console.log(e);
      erorHandler?.(e);
      return false;
    }
  };

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
