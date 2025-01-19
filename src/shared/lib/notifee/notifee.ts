import notifee, { TriggerType, TimestampTrigger, RepeatFrequency } from '@notifee/react-native';
import { addDays, setHours, setMinutes, setSeconds, sub } from 'date-fns';
import { PermissionsAndroid, Platform } from 'react-native';

export interface Notifee {
  scheduleWeeklyNotification: (time: Date) =>  Promise<string>;
  getTriggerNotificationIds: () => Promise<string[]>
  cancelNotification: (notificationId: string) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
}

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

const scheduleNotification = async (trigger: TimestampTrigger) => {
  await requestAndroidPermissions();
  // Request notification permissions (required for iOS)
  await notifee.requestPermission();

  
  const notificationId = await notifee.createTriggerNotification(
    {
      title: 'Weekly Reminder',
      body: 'This is your weekly reminder!',
      android: {
        channelId: 'default',
      },
    },
    trigger
  );

  return notificationId;
}

 const scheduleWeeklyNotification = async (time: Date) => {
  // Create a trigger
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: time.getTime(), // Timestamp in milliseconds
    repeatFrequency: RepeatFrequency.WEEKLY, // Repeats every week
  };

  const notificationId = await scheduleNotification(trigger);
  return notificationId;
}

const cancelNotification = async (notificationId: string) => {
  await notifee.cancelNotification(notificationId);
}

const cancelAllNotifications = async () => {
  await notifee.cancelAllNotifications();
}

const getTriggerNotificationIds = async () => {
  const triggerNotificationIds =  await notifee.getTriggerNotificationIds();
  return triggerNotificationIds;
}

export const notifeeLib: Notifee = {
  scheduleWeeklyNotification,
  cancelNotification,
  cancelAllNotifications,
  getTriggerNotificationIds,
};