import {makeAutoObservable} from 'mobx';

import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {userCategoryStore} from '@src/entities/UserCategory';
import {DocumentType} from '@src/shared/types/types';

class CategoryDetailsStore {
  constructor() {
    makeAutoObservable(this);
  }

  hideCategoryDetails = async (id: string) => {
    try {
      await userCategoryStore.updateUserCategory({
        id,
        field: 'isCategoryDetailsVisible',
        data: false,
      });

      navigation.replace(AppRouteNames.QUESTIONS, {
        id,
        type: DocumentType.CATEGORY,
      });
    } catch (e) {
      console.log(e);
    }
  };
}

export default new CategoryDetailsStore();
