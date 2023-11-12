import {makeAutoObservable} from 'mobx';
import Rate from 'react-native-rate';
import {Alert} from 'react-native';
import {t} from 'i18next';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {appPackageName} from '@src/app/config/appConfig';
import {rateUsStorage} from '@src/shared/lib/storage/adapters/rateUsAdapter';
import {RATE_TYPE_KEY} from '@src/shared/consts/storage';
import {userStore} from '@src/entities/User';

const options = {
  GooglePackageName: appPackageName,
  preferInApp: true,
  AppleAppID: '2193813192',
};

class InAppReviewStore {
  constructor() {
    makeAutoObservable(this);
  }

  rate = async () => {
    try {
      const rateType = await rateUsStorage.getRateUsData(RATE_TYPE_KEY);

      if (rateType === 'custom') {
        this.showCustomPopup();
        await rateUsStorage.setRateUsData(
          RATE_TYPE_KEY,
          JSON.stringify('native'),
        );

        return;
      }

      this.showNativePopup();
      await rateUsStorage.setRateUsData(RATE_TYPE_KEY, 'custom');
    } catch (e) {
      errorHandler({error: e, withToast: false});
    }
  };

  showNativePopup = () => {
    Rate.rate(options, (success, errorMessage) => {
      if (success) {
      }
      if (errorMessage) {
        console.error(`Example page Rate.rate() error: ${errorMessage}`);
      }
    });
  };

  showCustomPopup = () => {
    Alert.alert(t('questions.have_you_already_rated_this_app'), '', [
      {
        text: t('no') || '',
        style: 'cancel',
      },
      {
        text: t('yes') || '',
        onPress: async () => {
          await userStore.updateUser({
            field: 'hasUserRated',
            data: true,
          });
        },
      },
    ]);
  };
}

export default new InAppReviewStore();
