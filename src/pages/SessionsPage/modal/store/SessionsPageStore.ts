import {makeAutoObservable} from 'mobx';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {sessionStore} from '@src/entities/Session';
import {categoryStore} from '@src/entities/Category';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {userStore} from '@src/entities/User';

class SessionsPageStore {
  constructor() {
    makeAutoObservable(this);
  }

  init = async () => {
    try {
      sessionStore.setIsFetching(true);

      // the order is important
      await categoriesStore.fetchCategories();
      await userStore.fetchUser();
      await this.fetchQuadrantsAndSessions();
    } catch (e) {
      errorHandler({error: e});
    } finally {
      sessionStore.setIsFetching(false);
    }
  };

  fetchQuadrantsAndSessions = async () => {
    try {
      const level = categoryStore.category;
      if (!level) {
        return;
      }

      // the order is important
      await sessionStore.fetchQuadrants(level.id);
      await sessionStore.fetchSessions(level.id);
    } catch (e) {
      errorHandler({error: e});
    } finally {
      sessionStore.setIsFetching(false);
    }
  };
}

export default new SessionsPageStore();
