import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import crashlytics from '@react-native-firebase/crashlytics';

import {AuthMethod, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {AUTH_METHOD_STORAGE_KEY} from '@src/shared/consts/storage';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import { notifeeLib } from '@src/shared/lib/notifee/notifee';

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
      crashlytics().log('User tried to log out.');

      const isOffline = await userStore.checkIfUserOfflineAndShowMessage();
      if (isOffline) {
        actionAfterLogout();

        return;
      }

      this.setIsLoading(true);

      const authMethod = await authStorage.getAuthData(AUTH_METHOD_STORAGE_KEY);

      await userStore.updateUser({
        field: 'isAuth',
        data: false,
      });

      if (authMethod === AuthMethod.AUTH_BY_GOOGLE) {
        await GoogleSignin.signOut();
      }

      await auth().signOut();
      actionAfterLogout();
      userStore.clearUserInfo();
      notifeeLib.cancelAllNotifications();

      this.setIsLoading(false);
      navigation.resetHistoryAndNavigate(AppRouteNames.AUTH);
    } catch (e) {
      this.setIsLoading(false);
      errorHandler({error: e});
    }
  };
}

export default new LogoutStore();