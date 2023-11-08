import {makeAutoObservable} from 'mobx';
import Rate from 'react-native-rate';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {appPackageName} from '@src/app/config/appConfig';

const options = {
  GooglePackageName: appPackageName,
  preferInApp: true,
  AppleAppID: '2193813192',
};

class InAppReviewStore {
  constructor() {
    makeAutoObservable(this);
  }

  rate = async (actionAfterRating: () => void) => {
    try {
      Rate.rate(options, (success, errorMessage) => {
        if (success) {
        }
        if (errorMessage) {
          console.error(`Example page Rate.rate() error: ${errorMessage}`);
          errorHandler({error: errorMessage});
        }
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new InAppReviewStore();
