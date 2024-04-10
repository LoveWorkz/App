import {makeAutoObservable, runInAction} from 'mobx';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {sessionStore} from '@src/entities/Session';
import {categoriesStore} from '@src/pages/CategoriesPage';

class SessionsPageStore {
  isFetching: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  init = async () => {
    try {
      runInAction(() => {
        this.isFetching = true;
      });

      // the order is important
      await categoriesStore.fetchCategories();
      await sessionStore.fetchSessions();
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isFetching = false;
      });
    }
  };
}

export default new SessionsPageStore();
