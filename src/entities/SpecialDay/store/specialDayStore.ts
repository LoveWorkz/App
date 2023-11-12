import {makeAutoObservable} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {getDateYYYYMMDD} from '@src/shared/lib/date/date';
import {Collections} from '@src/shared/types/firebase';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {userStore} from '@src/entities/User';
import {SpecialDay} from './types/specialDayTypes';

class SpecialDayStore {
  specialDaysMap: Record<string, SpecialDay> = {};

  constructor() {
    makeAutoObservable(this);
  }

  setSpecialDaysMap = (specialDaysMap: Record<string, SpecialDay>) => {
    this.specialDaysMap = specialDaysMap;
  };

  fetchSpecialDays = async () => {
    try {
      crashlytics().log('Fetching Special Days');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const data = await firestore()
        .collection(Collections.SPECIAL_DAYS)
        .get({source});

      const specialDays = data.docs.map(item => {
        return {
          ...item.data(),
        };
      }) as SpecialDay[];

      const specialDaysMap: Record<string, SpecialDay> = {};
      specialDays.forEach(item => {
        specialDaysMap[item.date] = item;
      });

      this.setSpecialDaysMap(specialDaysMap);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  isTodaySpecial = async () => {
    const currentDate = new Date();
    const formattedDate = getDateYYYYMMDD(currentDate);
    const specialDay = this.specialDaysMap[formattedDate];

    return !!specialDay && specialDay.isActive;
  };
}

export default new SpecialDayStore();
