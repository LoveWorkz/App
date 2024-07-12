import crashlytics from '@react-native-firebase/crashlytics';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {t} from 'i18next';
import * as Sentry from '@sentry/react-native';

import {ToastType} from '@src/shared/ui/Toast/Toast';

export const errorHandler = ({
  error,
  withCrashlytics = true,
  withToast = true,
  message,
}: {
  error: unknown;
  withCrashlytics?: boolean;
  withToast?: boolean;
  message?: string;
}) => {
  if (!(error instanceof Error)) {
    return;
  }

  if (__DEV__) {
    console.error(message, error);
  }

  if (withCrashlytics) {
    crashlytics().recordError(error);
  }

  const messageText = t('error.title');

  Sentry.captureException(error);
  message && Sentry.captureMessage(message);

  if (withToast && messageText) {
    Toast.show({
      type: ToastType.ERROR,
      text1: messageText,
      topOffset: 60,
    });
  }
};
