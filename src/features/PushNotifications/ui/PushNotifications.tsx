import React, { memo, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { observer } from 'mobx-react-lite';

import { userStore } from '@src/entities/User';
import pushNotificationsStore from '../model/store/pushNotificationsStore';

const PushNotifications = () => {

  const inited = userStore.inited;

  useEffect(() => {
    if (!inited) return;

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
  }, [inited]);

  return (
    <></>
  );
}

export default memo(observer(PushNotifications));
