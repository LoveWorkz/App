import {makeAutoObservable} from 'mobx';
import Share, {ShareOptions} from 'react-native-share';

class ShareUsStore {
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  share = async (options: ShareOptions) => {
    try {
      await Share.open(options);
    } catch (err) {
      err && console.log(err);
    }
  };
}

export default new ShareUsStore();
