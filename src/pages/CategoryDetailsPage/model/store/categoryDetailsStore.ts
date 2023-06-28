import {makeAutoObservable} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {userCategoryStore} from '@src/entities/UserCategory';
import {DocumentType} from '@src/shared/types/types';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {categoryStore} from '@src/entities/Category';

class CategoryDetailsStore {
  isCategoryDetailsPageLoading: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  init = (id: string) => {
    try {
      crashlytics().log('Fetching category details page.');

      categoryStore.getAndSetCategory({id});
    } catch (e) {
      errorHandler({error: e});
    }
  };

  hideCategoryDetails = async (id: string) => {
    try {
      crashlytics().log(
        'User clicked the "Do not show again" button on category details page.',
      );

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
      errorHandler({error: e});
    }
  };
}

export default new CategoryDetailsStore();
