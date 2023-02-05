import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

import {AuthMethod, User, userFormatter, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigate} from '@src/shared/config/navigation/navigation';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {
  AUTH_METHOD_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from '@src/shared/consts/storage';
import {Collections} from '@src/shared/types/types';
import {InitlUserInfo} from '@src/entities/User';

class AuthByGoogleStore {
  constructor() {
    makeAutoObservable(this);
  }

  setUser = async (user: User) => {
    userStore.setAuthUser(user);

    authStorage.setAuthData(AUTH_METHOD_STORAGE_KEY, AuthMethod.AUTH_BY_GOOGLE);
    userStore.setAuthMethod(AuthMethod.AUTH_BY_GOOGLE);
    authStorage.setAuthData(AUTH_USER_STORAGE_KEY, JSON.stringify(user));

    const authUser = await (
      await firestore().collection(Collections.USERS).doc(user.id).get()
    ).data();

    if (authUser) {
      await firestore().collection(Collections.USERS).doc(user.id).update({
        isAuth: true,
      });
    } else {
      await firestore()
        .collection(Collections.USERS)
        .doc(user.id)
        .set({
          ...user,
          isAuth: true,
        });
    }
  };

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();

      const googleCredential = auth.GoogleAuthProvider.credential(
        result.idToken,
      );
      await auth().signInWithCredential(googleCredential);

      const currentUser = auth().currentUser;
      const formattedUser = userFormatter(currentUser as InitlUserInfo);
      await this.setUser(formattedUser);

      navigate(AppRouteNames.MAIN);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
}

export default new AuthByGoogleStore();
