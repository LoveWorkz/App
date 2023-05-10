import {makeAutoObservable} from 'mobx';
import Share, {ShareOptions} from 'react-native-share';
import Toast from 'react-native-toast-message';
import {t} from 'i18next';

import {userStore} from '@src/entities/User';
import {ToastType} from '@src/shared/ui/Toast/Toast';

class ShareUsStore {
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  share = async (options: ShareOptions) => {
    try {
      const isOffline = await userStore.getIsUserOffline();

      if (isOffline) {
        Toast.show({
          type: ToastType.WARNING,
          text1: t('you_are_offline') || '',
        });
        return;
      }

      await Share.open(options);
    } catch (err) {
      err && console.log(err);
    }
  };
}

export default new ShareUsStore();
