import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import appleAuth from '@invertase/react-native-apple-authentication';
import crashlytics from '@react-native-firebase/crashlytics';
import Toast from 'react-native-toast-message';
import {t} from 'i18next';

import {AuthMethod, User, userFormatter, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {Collections, FirebaseErrorCodes} from '@src/shared/types/firebase';
import {InitlUserInfo} from '@src/entities/User';
import {ToastType} from '@src/shared/ui/Toast/Toast';

class AuthByAppleStore {
  constructor() {
    makeAutoObservable(this);
  }

  setUser = async (user: User) => {
    userStore.setAuthUserInfo({
      user,
      authMethod: AuthMethod.AUTH_BY_APPLE,
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
    } else {
      await userStore.addUserToFirestore(user);
      await userStore.checkAndSetUserVisitStatus({isSignUp: true});
    }
  };
  appleSignIn = async () => {
    try {
      const isOffline = await userStore.getIsUserOffline();

      if (isOffline) {
        Toast.show({
          type: ToastType.WARNING,
          text1: t('you_are_offline') || '',
        });

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

      const formattedUser = userFormatter(currentUser as InitlUserInfo);
      await this.setUser(formattedUser);

      navigation.replace(AppRouteNames.TAB_ROUTE);
    } catch (error) {
      this.signInErrorHandler(error);
    }
  };

  signInErrorHandler = (error: unknown) => {
    if (!(error instanceof Error)) {
      return;
    }

    crashlytics().recordError(error);

    if (error.message.includes(FirebaseErrorCodes.AUTH_USER_DISABLED)) {
      userStore.toggleDialog(true);
    }
    console.log(error);
  };
}

export default new AuthByAppleStore();
