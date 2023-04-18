import {makeAutoObservable} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {Collections} from '@src/shared/types/firebase';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

class CategoryDetailsStore {
  constructor() {
    makeAutoObservable(this);
  }

  hideCategoryDetails = async (id: string) => {
    try {
      await firestore().collection(Collections.CATEGORIES).doc(id).update({
        isCategoryDetailsVisible: false,
      });
      navigation.replace(AppRouteNames.QUESTIONS, {id, type: 'category'});
    } catch (e) {
      console.log(e);
    }
  };
}

export default new CategoryDetailsStore();
