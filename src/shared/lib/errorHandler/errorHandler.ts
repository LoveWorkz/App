import crashlytics from '@react-native-firebase/crashlytics';
import {ToastType} from '@src/shared/ui/Toast/Toast';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {t} from 'i18next';

export const errorHandler = ({
  error,
  withCrashlytics = true,
  withToast = true,
}: {
  error: unknown;
  withCrashlytics?: boolean;
  withToast?: boolean;
}) => {
  if (!(error instanceof Error)) {
    return;
  }

  if (__DEV__) {
    console.log(error);
  }

  if (withCrashlytics) {
    crashlytics().recordError(error);
  }

  const messageText = t('error.title');

  if (withToast && messageText) {
    Toast.show({
      type: ToastType.ERROR,
      text1: messageText,
      topOffset: 60,
    });
  }
};
