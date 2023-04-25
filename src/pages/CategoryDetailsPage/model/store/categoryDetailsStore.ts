import {makeAutoObservable} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {Collections} from '@src/shared/types/firebase';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {userStore} from '@src/entities/User';

class CategoryDetailsStore {
  constructor() {
    makeAutoObservable(this);
  }

  hideCategoryDetails = async (id: string) => {
    try {
      const userId = userStore.authUserId;
      if (!userId) {
        return;
      }

      await firestore()
        .collection(Collections.USER_CATEGORIES)
        .doc(userId)
        .update({
          [`categories.${id}.isCategoryDetailsVisible`]: false,
        });
      navigation.replace(AppRouteNames.QUESTIONS, {id, type: 'category'});
    } catch (e) {
      console.log(e);
    }
  };
}

export default new CategoryDetailsStore();
