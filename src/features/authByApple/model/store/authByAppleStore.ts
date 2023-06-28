import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import appleAuth from '@invertase/react-native-apple-authentication';
import crashlytics from '@react-native-firebase/crashlytics';

import {AuthMethod, userFormatter, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {Collections, FirebaseErrorCodes} from '@src/shared/types/firebase';
import {InitlUserInfo} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';

class AuthByAppleStore {
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
        authMethod: AuthMethod.AUTH_BY_APPLE,
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
        const formattedUser = userFormatter(user as InitlUserInfo);

        await userStore.addUserToFirestore(formattedUser);
        await userStore.checkAndSetUserVisitStatus({isSignUp: true});
        navigation.replace(AppRouteNames.SETUP);
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  appleSignIn = async () => {
    try {
      const isOffline = await userStore.checkIfUserOfflineAndShowMessage();
      if (isOffline) {
        return;
      }

      crashlytics().log('User tried to sign in with Apple.');

      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      const {identityToken, nonce} = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      await auth().signInWithCredential(appleCredential);

      crashlytics().log('User signed in with Apple.');

      const currentUser = auth().currentUser;
      await this.setUser(currentUser as InitlUserInfo);
    } catch (error) {
      this.signInErrorHandler(error);
    }
  };

  signInErrorHandler = (error: any) => {
    const errorCodes = [appleAuth.Error.UNKNOWN, appleAuth.Error.CANCELED];
    const isUserCanceledAuthorisation = errorCodes.includes(error.code);

    if (error.message.includes(FirebaseErrorCodes.AUTH_USER_DISABLED)) {
      userStore.toggleDialog(true);
    } else {
      if (isUserCanceledAuthorisation) {
        return;
      }

      errorHandler({error});
    }
  };
}

export default new AuthByAppleStore();
