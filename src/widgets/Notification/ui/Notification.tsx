import React, {memo, useEffect} from 'react';
import {Text, View, Button, Platform, PermissionsAndroid} from 'react-native';
import notifee, { TriggerType, TimestampTrigger } from '@notifee/react-native';
import { addDays, setHours, setMinutes, setSeconds } from 'date-fns';
async function requestAndroidPermissions() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission not granted');
    }
  }
}

async function scheduleNotification() {
  // Request notification permissions (required for iOS)
  await requestAndroidPermissions();
  await notifee.requestPermission();
  const date = new Date(Date.now());
  date.setHours(23);
  date.setMinutes(32);

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Create a time-based trigger
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(), // fire at 11:10am (10 minutes before meeting)
  };

  // Create a trigger notification
  await notifee.createTriggerNotification(
    {
      title: 'Meeting with Jane',
      body: 'Today at 11:20am',
      android: {
        channelId,
      },
    },
    trigger,
  );
}

const Notification = () => {

  useEffect(() => {
    scheduleNotification();
  },[])
 

  return (
    <View>
    </View>
  );
};

export default Notification