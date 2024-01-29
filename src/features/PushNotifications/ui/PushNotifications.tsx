import React, { memo, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';

import pushNotificationsStore from '../model/store/pushNotificationsStore';

const PushNotifications = () => {

  useEffect(() => {
    pushNotificationsStore.init();

    const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
      const notification = remoteMessage.notification;
      if (notification) {
        pushNotificationsStore.onMessageHandler(remoteMessage.notification);
      }
    });

    return () => {
      unsubscribe();
    }
  }, []);

  return (
    <></>
  );
}

export default memo(PushNotifications);
