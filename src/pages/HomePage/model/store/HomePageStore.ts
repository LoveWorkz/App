import {makeAutoObservable, runInAction} from 'mobx';
import {TFunction} from 'i18next';

import {categoriesStore} from '@src/pages/CategoriesPage';
import {profileStore} from '@src/entities/Profile';
import {challengesStore} from '@src/pages/ChallengesPage';

class HomePageStore {
  isHomePageLoading: boolean = true;
  constructor() {
    makeAutoObservable(this);
  }

  init = async (t: TFunction) => {
    try {
      runInAction(() => {
        this.isHomePageLoading = true;
      });
      await profileStore.fetchProfile();
      await categoriesStore.fetchUserCategories();
      await categoriesStore.fetchCategories(t);
      await challengesStore.fetchUserChallengeCategory();
      await challengesStore.fetchChallengeCategories();
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
