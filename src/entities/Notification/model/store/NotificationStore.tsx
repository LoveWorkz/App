import crashlytics from '@react-native-firebase/crashlytics';

import {onboardingStorage} from '@src/shared/lib/storage/adapters/onboardingAdapter';
import {NOTIFICATIONS_KEY} from '@src/shared/consts/storage';
import {NotificationsPreferencesType} from '@src/entities/Notification';
import {quotesStore} from '@src/widgets/Quotes';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';

class NotificationStore {
  initUserNotifications = async () => {
    try {
      crashlytics().log('Init user notifications.');

      const valueFromStorage = await onboardingStorage.getOnboardingData(
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

        onboardingStorage.removeOnboardingData(NOTIFICATIONS_KEY);
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

    const valueFromStorage = await onboardingStorage.getOnboardingData(
      NOTIFICATIONS_KEY,
    );

    let notifications: NotificationsPreferencesType = {
      ...(valueFromStorage ? JSON.parse(valueFromStorage) : {}),
      [field]: visible,
    };

    await onboardingStorage.setOnboardingData(
      NOTIFICATIONS_KEY,
      JSON.stringify(notifications),
    );
  };
}

export default new NotificationStore();
