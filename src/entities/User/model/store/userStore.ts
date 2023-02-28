import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';

import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/config/navigation/navigation';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {AUTH_METHOD_STORAGE_KEY, AUTH_USER_STORAGE_KEY} from '@src/shared/consts/storage';
import {profileStore} from '@src/entities/Profile';
import { FirebaseErrorCodes } from '@src/shared/types/firebase';
import {User, InitlUserInfo, AuthMethod} from '../types/userSchema';
import {userFormatter} from '../../lib/userForamtter';

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

        navigation.replace(AppRouteNames.MAIN);
      } else {
        navigation.replace(AppRouteNames.AUTH);
      }
    } catch (e: unknown) {
      console.log(e);
      this.errorHandler(e);
    }
  };

  errorHandler = async (e: unknown) => {
    if (!(e instanceof Error)) {
      return;
    }

    if (e.message.includes(FirebaseErrorCodes.AUTH_USER_NOT_FOUND)) {
      await this.clearUserInfo();
      navigation.navigate(AppRouteNames.AUTH);
    }

    if (e.message.includes(FirebaseErrorCodes.AUTH_USER_DISABLED)) {
      await this.clearUserInfo();
      Alert.alert('Your account is disabled');
      navigation.navigate(AppRouteNames.AUTH);
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
        // using sign in and sign out for refresh id token
        // without it reauthenticateWithCredential not working
        await GoogleSignin.signInSilently();
        const tokens = await GoogleSignin.getTokens();
        await GoogleSignin.signOut();

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

  clearUserInfo = async () => {
    try {
      this.setAuthUser(null);
      profileStore.clearProfileData();
      
      await authStorage.removeAuthData(AUTH_USER_STORAGE_KEY);
      await authStorage.removeAuthData(AUTH_METHOD_STORAGE_KEY);
    } catch (e) {
      console.log(e);
    }
  };
}

export default new UserStore();
