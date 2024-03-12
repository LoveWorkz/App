import {makeAutoObservable} from 'mobx';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {notificationStore} from '@src/entities/Notification';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {onboardingStorage} from '@src/shared/lib/storage/adapters/onboardingAdapter';
import {HAS_COMPLETED_ONBOARDING_KEY} from '@src/shared/consts/storage';

class OnboardingStore {
  constructor() {
    makeAutoObservable(this);
  }

  allowNotificationsAndNavigate = async () => {
    try {
      await notificationStore.allowNotifications();
      navigation.navigate(AppRouteNames.ONBOARDING_STATISTIC);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setOnboardingStatusAndNavigate = async () => {
    await onboardingStorage.setOnboardingData(
      HAS_COMPLETED_ONBOARDING_KEY,
      JSON.stringify(true),
    );
    navigation.resetHistoryAndNavigate(AppRouteNames.AUTH);
  };
}

export default new OnboardingStore();
