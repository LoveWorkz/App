import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {AuthMethod, userFormatter, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {Collections, FirebaseErrorCodes} from '@src/shared/types/firebase';
import {InitlUserInfo} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';

class AuthByGoogleStore {
  constructor() {
    makeAutoObservable(this);
  }

  setUser = async (user: InitlUserInfo | null) => {
    try {
      if (!user) {
        return;
      }
      const userId = user.uid;

      userStore.setAuthUserInfo({
        userId: userId,
        authMethod: AuthMethod.AUTH_BY_GOOGLE,
      });

      const authUser = await firestore()
        .collection(Collections.USERS)
        .doc(userId)
        .get();

      if (authUser.exists) {
        userStore.updateUser({
          field: 'isAuth',
          data: true,
        });

        await userStore.checkAndSetUserVisitStatus({isSignUp: false});
        navigation.replace(AppRouteNames.TAB_ROUTE);
      } else {
        const formattedUser = userFormatter(user);

        await userStore.addUserToFirestore(formattedUser);
        await userStore.checkAndSetUserVisitStatus({isSignUp: true});
        navigation.replace(AppRouteNames.SETUP);
      }
    } catch (e) {
      // console.error('SET USER: ', e);
      errorHandler({error: e});
    }
  };
  signIn = async () => {
    try {
      const isOffline = await userStore.checkIfUserOfflineAndShowMessage();
      // console.info('isOffline', isOffline);
      if (isOffline) {
        return;
      }

      crashlytics().log('User tried to sign in with Google.');

      await GoogleSignin.hasPlayServices();
      // console.log('HAS SERVICES');
      const result = await GoogleSignin.signIn();
      // console.info('result', result);
      const googleCredential = auth.GoogleAuthProvider.credential(
        result.idToken,
      );
      // console.info('googleCredential', googleCredential);
      await auth().signInWithCredential(googleCredential);
      crashlytics().log('User signed in with Google.');
      const currentUser = auth().currentUser;
      // console.info('currentUser', currentUser);

      await this.setUser(currentUser as InitlUserInfo);
    } catch (error: any) {
      const isUserCanceledAuthorisation =
        error.code === statusCodes.SIGN_IN_CANCELLED;
      // console.error('isUserCanceledAuthorisation', isUserCanceledAuthorisation);
      // console.info('SIGN IN: ', error);
      // errorHandler({error});

      if (error.message.includes(FirebaseErrorCodes.AUTH_USER_DISABLED)) {
        userStore.toggleDialog(true);
      } else {
        if (isUserCanceledAuthorisation) {
          return;
        }
        // console.error('SIGN IN: ', error);
        errorHandler({error});
      }
    }
  };
}

export default new AuthByGoogleStore();
