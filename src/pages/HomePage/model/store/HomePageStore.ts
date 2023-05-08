import {makeAutoObservable, runInAction} from 'mobx';

import {categoriesStore} from '@src/pages/CategoriesPage';
import {profileStore} from '@src/entities/Profile';
import {challengesStore} from '@src/pages/ChallengesPage';
import {booksStore} from '@src/pages/BooksPage';
import {CategoryName, categoryStore} from '@src/entities/Category';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';

class HomePageStore {
  isHomePageLoading: boolean = true;
  homePageCategoryName: string = '';
  homePageCategoryKey: CategoryName = 'Starter'; // first category

  constructor() {
    makeAutoObservable(this);
  }

  init = async (language: LanguageValueType) => {
    try {
      runInAction(() => {
        this.isHomePageLoading = true;
      });
      await profileStore.fetchProfile();
      await categoriesStore.fetchCategories();
      await categoriesStore.fetchRubrics();
      await challengesStore.fetchChallengeCategories();
      // fetching books for quotes modal
      await booksStore.getBooks();
      this.getHomePageCategory(language);
    } catch (e) {
      console.log(e);
    } finally {
      runInAction(() => {
        this.isHomePageLoading = false;
      });
    }
  };

  getHomePageCategory = (language: LanguageValueType) => {
    try {
      const userCurrentCategoryKey = profileStore.currentCategory
        ?.currentCategory as CategoryName;

      if (!userCurrentCategoryKey) {
        return;
      }

      const category = categoryStore.getCategoryByName(userCurrentCategoryKey);

      if (!category) {
        return;
      }

      let homePageCategoryName = category.displayName[language];
      let homePageCategoryKey = userCurrentCategoryKey;

      const categories = categoriesStore.categories;
      const lastCategory = categories[categories.length - 1];
      const penultimateCategory = categories[categories.length - 2];

      // if it's the last category show penultimate category, we should not show the last category
      if (userCurrentCategoryKey === lastCategory.name) {
        homePageCategoryName = penultimateCategory.displayName[language];
        homePageCategoryKey = penultimateCategory.name;
      }

      runInAction(() => {
        this.homePageCategoryName = homePageCategoryName;
        this.homePageCategoryKey = homePageCategoryKey;
      });
    } catch (e) {
      console.log(e);
    }
  };
}

export default new HomePageStore();
