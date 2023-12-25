const firstCharUpperCase = require('../firstCharUpperCase');

module.exports = sliceName => {
  const formattedSliceName = firstCharUpperCase(sliceName);

  return `import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';

class ${formattedSliceName}Store {
  constructor() {
    makeAutoObservable(this);
  }

  action = async () => {
    try {
      crashlytics().log('');

      runInAction(() => {});
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new ${formattedSliceName}Store();`;
};
