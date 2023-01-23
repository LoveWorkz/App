import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import {AuthMethod, userFormatter, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/configRoute';
import {navigate} from '@src/shared/config/navigation/navigation';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {AUTH_METHOD_STORAGE_KEY} from '@src/shared/consts/storage';

class AuthByGoogleStore {
  constructor() {
    makeAutoObservable(this);
  }

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userData = await GoogleSignin.signIn();
      const formattedUser = userFormatter(
        userData as any,
        AuthMethod.AUTH_BY_GOOGLE,
      );
      userStore.setAuthUser(formattedUser);
      authStorage.setAuthData(
        AUTH_METHOD_STORAGE_KEY,
        AuthMethod.AUTH_BY_GOOGLE,
      );
      navigate(AppRouteNames.MAIN);

      const googleCredential = auth.GoogleAuthProvider.credential(
        userData.idToken,
      );

      await auth().signInWithCredential(googleCredential);
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
