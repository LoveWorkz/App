import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import {t} from 'i18next';

import {AuthMethod, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {AUTH_METHOD_STORAGE_KEY} from '@src/shared/consts/storage';
import {ToastType} from '@src/shared/ui/Toast/Toast';

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
      const isOffline = await userStore.getIsUserOffline();

      if (isOffline) {
        Toast.show({
          type: ToastType.WARNING,
          text1: t('you_are_offline') || '',
        });
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

      this.setIsLoading(false);
      navigation.resetHistoryAndNavigate(AppRouteNames.AUTH);
    } catch (e) {
      this.setIsLoading(false);
      console.error(e);
    }
  };
}

export default new LogoutStore();
