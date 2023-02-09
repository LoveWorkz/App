import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

import {AuthMethod, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigate} from '@src/shared/config/navigation/navigation';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {
  AUTH_METHOD_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from '@src/shared/consts/storage';
import {Collections} from '@src/shared/types/types';
import {profileStore} from '@src/entities/Profile';

class LogoutStore {
  constructor() {
    makeAutoObservable(this);
  }

  logout = async () => {
    const authMethod = await authStorage.getAuthData(AUTH_METHOD_STORAGE_KEY);

    try {
      await firestore()
        .collection(Collections.USERS)
        .doc(userStore.authUser?.id)
        .update({
          isAuth: false,
        });
      await authStorage.removeAuthData(AUTH_USER_STORAGE_KEY);

      if (authMethod === AuthMethod.AUTH_BY_GOOGLE) {
        await GoogleSignin.revokeAccess();
      }
      await auth().signOut();
      navigate(AppRouteNames.AUTH);
      userStore.setAuthUser(null);
      profileStore.setProfileData(null);
    } catch (e) {
      console.error(e);
    }
  };
}

export default new LogoutStore();
