import {makeAutoObservable} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import firestore from '@react-native-firebase/firestore';
import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {Therapist} from './types';

class TherapistsStore {
  isLoading: boolean = false;
  therapists: Therapist[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  init = async () => {
    try {
      crashlytics().log('Fetching Challenges page.');
      await this.fetchTherapists();
    } catch (e) {
      errorHandler({error: e});
    } finally {
    }
  };

  setIsLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };

  setTherapists = (newTherapists: Therapist[]) => {
    this.therapists = newTherapists;
  };

  fetchTherapists = async () => {
    try {
      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const data = await firestore()
        .collection(Collections.THERAPISTS)
        .get({source});

      const therapists = data.docs.map(therapist => {
        return {
          ...(therapist.data() as Therapist),
          id: therapist.id,
        };
      });

      this.setTherapists(therapists);
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new TherapistsStore();
