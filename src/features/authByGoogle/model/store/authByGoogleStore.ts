import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

import {AuthMethod, User, userFormatter, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/config/navigation/navigation';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {
  AUTH_METHOD_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from '@src/shared/consts/storage';
import {CloudStoragePaths, Collections} from '@src/shared/types/firebase';
import {InitlUserInfo} from '@src/entities/User';
import {StorageServices} from '@src/shared/lib/firebase/storageServices/storageServices';

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

  uploadUserPhoto = async (user: InitlUserInfo) => {
    const cloudStorage = new StorageServices({
      folderName: CloudStoragePaths.AVATARS,
      fileName: user.uid,
    });

    user.photoURL && cloudStorage.upload(user.photoURL);
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

      this.uploadUserPhoto(currentUser as InitlUserInfo);

      const formattedUser = userFormatter(currentUser as InitlUserInfo);
      await this.setUser(formattedUser);

      navigation.replace(AppRouteNames.MAIN);
    } catch (error) {
      console.log(error);
    }
  };
}

export default new AuthByGoogleStore();
