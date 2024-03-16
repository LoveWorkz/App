import {makeAutoObservable} from 'mobx';
import messaging from '@react-native-firebase/messaging';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import crashlytics from '@react-native-firebase/crashlytics';

import {isPlatformIos} from '@src/shared/consts/common';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {User, userStore} from '@src/entities/User';

class PushNotificationsStore {
  constructor() {
    makeAutoObservable(this);
  }

  init = async () => {
    try {
      crashlytics().log('Init push notifications');

      const user = userStore.user;
      if (!user) {
        return;
      }

      const hasPermission = await this.requestUserPermission();
      if (hasPermission) {
        await messaging().subscribeToTopic('allUsers');
        this.getAndSetFcmToken(user);
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getAndSetFcmToken = async (user: User) => {
    const newToken = await this.getToken();
    const fcmToken = user.notification.fcmToken;

    if (newToken !== fcmToken) {
      userStore.setNotification({field: 'fcmToken', value: newToken});
    }
  };

  onMessageHandler = (notification: {title: string; body: string}) => {
    Toast.show({
      type: 'info',
      text1: notification.title,
      text2: notification.body,
      visibilityTime: 8000,
      topOffset: 60,
    });
  };

  requestUserPermission = async () => {
    try {
      if (isPlatformIos) {
        const result = this.requestUserIosPermission();
        return result;
      }

      const result = await this.requestUserAndroidPermission();
      return result;
    } catch (e) {
      errorHandler({error: e});
      return false;
    }
  };

  requestUserAndroidPermission = async () => {
    crashlytics().log('Request permissions for android');

    return true;
  };

  requestUserIosPermission = async () => {
    crashlytics().log('Request permissions for ios');

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  };

  getToken = async () => {
    crashlytics().log('Getting fcmToken');

    const fcmToken = await messaging().getToken();
    return fcmToken;
  };
}

export default new PushNotificationsStore();
