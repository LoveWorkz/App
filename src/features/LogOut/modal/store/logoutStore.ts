import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

import {AuthMethod, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {AUTH_METHOD_STORAGE_KEY} from '@src/shared/consts/storage';
import {Collections} from '@src/shared/types/firebase';

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
        await GoogleSignin.signOut();
      }

      await auth().signOut();
      actionAfterLogout();
      userStore.clearUserInfo();

      this.setIsLoading(false);
      navigation.resetHistoryAndNavigate(AppRouteNames.AUTH);
    } catch (e) {
      this.setIsLoading(false);
      console.error(e);
    }
  };
}

export default new LogoutStore();
