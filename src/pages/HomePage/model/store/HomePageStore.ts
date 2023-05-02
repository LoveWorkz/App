import {makeAutoObservable, runInAction} from 'mobx';

import {categoriesStore} from '@src/pages/CategoriesPage';
import {profileStore} from '@src/entities/Profile';
import {challengesStore} from '@src/pages/ChallengesPage';
import {booksStore} from '@src/pages/BooksPage';

class HomePageStore {
  isHomePageLoading: boolean = true;
  constructor() {
    makeAutoObservable(this);
  }

  init = async () => {
    try {
      runInAction(() => {
        this.isHomePageLoading = true;
      });
      await profileStore.fetchProfile();
      await categoriesStore.fetchUserCategories();
      await categoriesStore.fetchCategories();
      await challengesStore.fetchUserChallengeCategory();
      await challengesStore.fetchChallengeCategories();
      await booksStore.getBooks();
    } catch (e) {
      console.log(e);
    } finally {
      runInAction(() => {
        this.isHomePageLoading = false;
      });
    }
  };
}

export default new HomePageStore();
