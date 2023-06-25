import {makeAutoObservable} from 'mobx';
import Rate from 'react-native-rate';
import {Alert} from 'react-native';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {appPackageName} from '@src/app/config/appConfig';

const options = {
  AmazonPackageName: appPackageName,
  preferInApp: true,
};

class InAppReviewStore {
  constructor() {
    makeAutoObservable(this);
  }

  rate = async () => {
    try {
      Rate.rate(options, (success, errorMessage) => {
        if (success) {
          // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
          Alert.alert('rated');
        }
        if (errorMessage) {
          // errorMessage comes from the native code. Useful for debugging, but probably not for users to view
          console.error(`Example page Rate.rate() error: ${errorMessage}`);
        }
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new InAppReviewStore();
