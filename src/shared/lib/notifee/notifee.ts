import notifee, { TriggerType, TimestampTrigger, RepeatFrequency, AndroidImportance, AndroidNotificationSetting  } from '@notifee/react-native';
import { addDays, setHours, setMinutes, setSeconds, sub } from 'date-fns';
import { PermissionsAndroid, Platform } from 'react-native';

export interface Notifee {
  scheduleWeeklyNotification: (time: Date, scheduleTime: Date) =>  Promise<string>;
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

function formatNotificationMessage(time: Date, date: Date): string {
  // Get the weekday name
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekDay = weekDays[time.getDay()]; // Get the weekday from the Date object
  console.log('WWWW', weekDay, time.getDay());
  

  // Format the time in "HH:mm" format (24-hour clock)
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  // Construct the message
  return `Don't forget about your next session: ${weekDay} at ${formattedTime}`;
}

const scheduleNotification = async (trigger: TimestampTrigger, time: Date, scheduleTime: Date) => {
  console.log('---- MTAV STE ----');
  

  const notificationId = await notifee.createTriggerNotification(
    {
      title: 'Weekly Reminder',
      body: formatNotificationMessage(time, scheduleTime),
      android: {
        channelId: 'important',
        importance: AndroidImportance.HIGH,
      },
      ios: {
        critical: true,
        interruptionLevel: "timeSensitive", // High priority for critical notifications
      }
    },
    trigger
  );

  return notificationId;
}

 const scheduleWeeklyNotification = async (time: Date, scheduleTime: Date) => {

  // const intent = 'android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS';
  // await Linking.openSettings();
  // Create a trigger

  console.log(time, "tIME")
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: time.getTime(), // Timestamp in milliseconds
    repeatFrequency: RepeatFrequency.WEEKLY, // Repeats every week
    alarmManager: {
      allowWhileIdle: true,
    }
  };

  const notificationId = await scheduleNotification(trigger, time, scheduleTime);
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