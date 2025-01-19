import notifee, { TriggerType, TimestampTrigger, RepeatFrequency } from '@notifee/react-native';
import { addDays, setHours, setMinutes, setSeconds } from 'date-fns';
import { PermissionsAndroid, Platform } from 'react-native';


export interface Notifee {
  scheduleWeeklyNotification: (targetWeekday: number) => void;
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

  
  const data = await notifee.createTriggerNotification(
    {
      title: 'Weekly Reminder',
      body: 'This is your weekly reminder!',
      android: {
        channelId: 'default',
      },
    },
    trigger
  );

  return data;
}

 const scheduleWeeklyNotification = async (targetWeekday: number) => {
  // Get the current date and time
  const now = new Date();

  // Find the next occurrence of the target weekday
  let targetDate = addDays(now, (targetWeekday - now.getDay() + 7) % 7);

  // Set the specific time
  targetDate = setHours(targetDate, 10); // 10 AM
  targetDate = setMinutes(targetDate, 0);
  targetDate = setSeconds(targetDate, 0);

  // Create a trigger
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: targetDate.getTime(), // Timestamp in milliseconds
    repeatFrequency: RepeatFrequency.WEEKLY, // Repeats every week
  };

  const data = await scheduleNotification(trigger);
  console.log(data, "data");
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