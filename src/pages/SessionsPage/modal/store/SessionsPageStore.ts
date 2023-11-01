import {makeAutoObservable, runInAction} from 'mobx';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {sessionStore} from '@src/entities/Session';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';

class SessionsPageStore {
  isFetching: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  init = async ({
    isCategoryAllInOne,
    language,
  }: {
    isCategoryAllInOne: boolean;
    language: LanguageValueType;
  }) => {
    try {
      runInAction(() => {
        this.isFetching = true;
      });

      const unlockedCategories = categoriesStore.unlockedCategories;

      // the order is important
      await categoriesStore.fetchCategories();

      if (isCategoryAllInOne) {
        await sessionStore.fetchAllSessionsFromAllCategories({
          unlockedCategories,
          language,
        });

        return;
      }

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
