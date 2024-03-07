import crashlytics from '@react-native-firebase/crashlytics';

import {notificationsStorage} from '@src/shared/lib/storage/adapters/notificationsAdapter';
import {NOTIFICATIONS_KEY} from '@src/shared/consts/storage';
import {NotificationsPreferencesType} from '@src/entities/Notification';
import {quotesStore} from '@src/widgets/Quotes';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';

class NotificationStore {
  initUserNotifications = async () => {
    try {
      crashlytics().log('Init user notifications.');

      const valueFromStorage = await notificationsStorage.getNotifications(
        NOTIFICATIONS_KEY,
      );

      // If a user has selected some notifications during the onboarding process, add them to the database
      if (valueFromStorage) {
        const notificationsFromStorage: NotificationsPreferencesType =
          JSON.parse(valueFromStorage);

        const quotes = notificationsFromStorage.quotes;
        if (typeof quotes === 'boolean') {
          await quotesStore.updateQuotesVisible(quotes);
        }

        notificationsStorage.removeNotifications(NOTIFICATIONS_KEY);
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateNotificationsStorage = async ({
    visible,
    field,
  }: {
    visible: boolean;
    field: keyof NotificationsPreferencesType;
  }) => {
    crashlytics().log('Update user notifications inside storage.');

    const valueFromStorage = await notificationsStorage.getNotifications(
      NOTIFICATIONS_KEY,
    );

    let notifications: NotificationsPreferencesType = {
      ...(valueFromStorage ? JSON.parse(valueFromStorage) : {}),
      [field]: visible,
    };

    await notificationsStorage.setNotifications(
      NOTIFICATIONS_KEY,
      JSON.stringify(notifications),
    );
  };
}

export default new NotificationStore();
