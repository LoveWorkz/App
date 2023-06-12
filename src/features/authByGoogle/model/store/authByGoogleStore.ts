import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {AuthMethod, User, userFormatter, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {Collections, FirebaseErrorCodes} from '@src/shared/types/firebase';
import {InitlUserInfo} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';

class AuthByGoogleStore {
  constructor() {
    makeAutoObservable(this);
  }

  setUser = async (user: User) => {
    try {
      userStore.setAuthUserInfo({
        user,
        authMethod: AuthMethod.AUTH_BY_GOOGLE,
      });

      const authUser = await firestore()
        .collection(Collections.USERS)
        .doc(user.id)
        .get();

      if (authUser.exists) {
        userStore.updateUser({
          field: 'isAuth',
          data: true,
        });
        await userStore.checkAndSetUserVisitStatus({isSignUp: false});
        navigation.replace(AppRouteNames.TAB_ROUTE);
      } else {
        await userStore.addUserToFirestore(user);
        await userStore.checkAndSetUserVisitStatus({isSignUp: true});
        navigation.replace(AppRouteNames.SETUP);
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };
  signIn = async () => {
    try {
      const isOffline = await userStore.checkIfUserOfflineAndShowMessage();
      if (isOffline) {
        return;
      }

      crashlytics().log('User tried to sign in with Google.');

      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();

      const googleCredential = auth.GoogleAuthProvider.credential(
        result.idToken,
      );
      await auth().signInWithCredential(googleCredential);

      crashlytics().log('User signed in with Google.');

      const currentUser = auth().currentUser;

      const formattedUser = userFormatter(currentUser as InitlUserInfo);
      await this.setUser(formattedUser);
    } catch (error: any) {
      const isUserCanceledAuthorisation =
        error.code === statusCodes.SIGN_IN_CANCELLED;

      if (error.message.includes(FirebaseErrorCodes.AUTH_USER_DISABLED)) {
        userStore.toggleDialog(true);
      } else {
        if (isUserCanceledAuthorisation) {
          return;
        }

        errorHandler({error});
      }
    }
  };
}

export default new AuthByGoogleStore();
