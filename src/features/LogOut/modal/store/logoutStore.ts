import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

import {AuthMethod, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/config/navigation/navigation';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {
  AUTH_METHOD_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from '@src/shared/consts/storage';
import {Collections} from '@src/shared/types/types';
import {profileStore} from '@src/entities/Profile';

class LogoutStore {
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  logout = async (actionAfterLogout: () => void) => {
    try {
      this.setIsLoading(true);

      const authMethod = await authStorage.getAuthData(AUTH_METHOD_STORAGE_KEY);
      await firestore()
        .collection(Collections.USERS)
        .doc(userStore.authUser?.id)
        .update({
          isAuth: false,
        });

      if (authMethod === AuthMethod.AUTH_BY_GOOGLE) {
        await GoogleSignin.revokeAccess();
      }
      await authStorage.removeAuthData(AUTH_USER_STORAGE_KEY);
      await authStorage.removeAuthData(AUTH_METHOD_STORAGE_KEY);

      await auth().signOut();
      this.setIsLoading(false);
      actionAfterLogout();

      navigation.resetHistoryAndNavigate(AppRouteNames.AUTH);

      userStore.setAuthUser(null);
      profileStore.clearProfileData();
    } catch (e) {
      this.setIsLoading(false);
      console.error(e);
    }
  };
}

export default new LogoutStore();
