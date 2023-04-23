import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import appleAuth from '@invertase/react-native-apple-authentication';

import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {
  AUTH_METHOD_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from '@src/shared/consts/storage';
import {profileStore} from '@src/entities/Profile';
import {Collections, FirebaseErrorCodes} from '@src/shared/types/firebase';
import {ProfilePhotoActionType} from '@src/entities/Profile/model/types/profileSchema';
import {
  User,
  InitlUserInfo,
  AuthMethod,
  AuthUserInfo,
} from '../types/userSchema';
import {userFormatter} from '../../lib/userForamtter';

class UserStore {
  authUser: null | User = null;
  authUserId: string = '';
  authMethod: AuthMethod | string = '';
  isDisabledDialogOpen: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAuthUserInfo({user, authMethod}: AuthUserInfo) {
    this.authUser = user;
    if (user?.id) {
      this.authUserId = user.id;
    }
    this.authMethod = authMethod;

    authStorage.setAuthData(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    authStorage.setAuthData(AUTH_METHOD_STORAGE_KEY, authMethod);
  }

  toggleDisabledDialog(isOpen: boolean) {
    this.isDisabledDialogOpen = isOpen;
  }

  initAuthUser = async () => {
    try {
      const network = await NetInfo.fetch();
      network.isConnected && (await auth().currentUser?.reload());
      const user = auth().currentUser;

      if (user) {
        const formattedUser = userFormatter(user as InitlUserInfo);
        const authMethod = (await authStorage.getAuthData(
          AUTH_METHOD_STORAGE_KEY,
        )) as AuthMethod;

        this.setAuthUserInfo({
          user: formattedUser,
          authMethod: authMethod || '',
        });

        navigation.navigate(AppRouteNames.TAB_ROUTE);
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
      navigation.navigate(AppRouteNames.AUTH);
      this.toggleDisabledDialog(true);
    }
  };

  reauthenticateWithCredential = async ({
    email,
    password,
    erorHandler,
  }: {
    email?: string;
    password?: string;
    erorHandler?: (e: unknown) => void;
  }) => {
    try {
      let credential;

      switch (this.authMethod) {
        case AuthMethod.AUTH_BY_EMAIL:
          if (email && password) {
            credential = auth.EmailAuthProvider.credential(email, password);
          }
          break;
        case AuthMethod.AUTH_BY_GOOGLE:
          // using sign in and sign out for refresh id token
          // without it reauthenticateWithCredential not working
          await GoogleSignin.signInSilently();
          const tokens = await GoogleSignin.getTokens();
          await GoogleSignin.signOut();

          credential = auth.GoogleAuthProvider.credential(tokens.idToken);
          break;
        default:
          const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
          });
          const {identityToken, nonce} = appleAuthRequestResponse;
          credential = auth.AppleAuthProvider.credential(identityToken, nonce);
      }

      const currentUser = auth().currentUser;
      credential &&
        (await currentUser?.reauthenticateWithCredential(credential));
      return true;
    } catch (e) {
      erorHandler?.(e);
      return false;
    }
  };

  clearUserInfo = async () => {
    try {
      this.setAuthUserInfo({
        user: null,
        authMethod: '',
      });
      profileStore.clearProfileData();

      await authStorage.removeAuthData(AUTH_USER_STORAGE_KEY);
      await authStorage.removeAuthData(AUTH_METHOD_STORAGE_KEY);
    } catch (e) {
      console.log(e);
    }
  };

  clearFirebaseUserInfo = async (id: string) => {
    await firestore().collection(Collections.USERS).doc(id).delete();
    await profileStore.profilePhotoAction(ProfilePhotoActionType.DELETE);
  };

  updateUser = async ({data, field}: {data: any; field: string}) => {
    const userId = this.authUserId;
    if (!userId) {
      return;
    }

    await firestore()
      .collection(Collections.USERS)
      .doc(userId)
      .update({
        [field]: data,
      });
  };
}

export default new UserStore();
