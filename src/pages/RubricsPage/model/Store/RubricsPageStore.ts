import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {rubricStore} from '@src/entities/Rubric';
import {categoriesStore} from '@src/pages/CategoriesPage';

class RubricsPageStore {
  isRubricsPageLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  init = async () => {
    try {
      crashlytics().log('Fetching Rubrics page');

      runInAction(() => {
        this.isRubricsPageLoading = true;
      });

      await categoriesStore.fetchCategories();
      await rubricStore.fetchRubrics();
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isRubricsPageLoading = false;
      });
    }
  };
}

export default new RubricsPageStore();
