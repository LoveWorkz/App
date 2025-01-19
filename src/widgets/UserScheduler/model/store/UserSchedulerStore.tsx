import { makeAutoObservable, runInAction } from "mobx";
import crashlytics from '@react-native-firebase/crashlytics';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import { USER_SCHEDULERS_KEY } from '@src/shared/consts/storage';
import { userSchedulersAdapterStorage } from "@src/shared/lib/storage/adapters/userSchedulersAdapter";

class UserSchedulerStore {
  isUserSchedulerLoading: boolean = true;
  constructor() {
    makeAutoObservable(this)
  }

  init = async () => {
    try {
      crashlytics().log('Fetching user schedulers');

      runInAction(() => {
        this.isUserSchedulerLoading = true;
      });
      // await userSchedulersAdapterStorage.setUserSchedulers(USER_SCHEDULERS_KEY, JSON.stringify({name: 'JHON'}))
      // const data = await userSchedulersAdapterStorage.getUserSchedulers('asdas');
      // console.log(data, "this is data")      
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isUserSchedulerLoading = false;
      });
    }
  }
}

export default new UserSchedulerStore();