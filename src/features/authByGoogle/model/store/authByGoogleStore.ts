import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

import {AuthMethod, User, userFormatter, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {Collections, FirebaseErrorCodes} from '@src/shared/types/firebase';
import {InitlUserInfo} from '@src/entities/User';

class AuthByGoogleStore {
  constructor() {
    makeAutoObservable(this);
  }

  setUser = async (user: User) => {
    userStore.setAuthUserInfo({
      user,
      authMethod: AuthMethod.AUTH_BY_GOOGLE,
    });

    const authUser = await await firestore()
      .collection(Collections.USERS)
      .doc(user.id)
      .get();

    if (authUser.exists) {
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

      navigation.replace(AppRouteNames.MAIN);
    } catch (error) {
      if (!(error instanceof Error)) {
        return;
      }

      if (error.message.includes(FirebaseErrorCodes.AUTH_USER_DISABLED)) {
        userStore.toggleDisabledDialog(true);
      }
      console.log(error);
    }
  };
}

export default new AuthByGoogleStore();
