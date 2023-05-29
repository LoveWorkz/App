import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {categoriesStore} from '@src/pages/CategoriesPage';
import {profileStore} from '@src/entities/Profile';
import {challengesStore} from '@src/pages/ChallengesPage';
import {booksStore} from '@src/pages/BooksPage';
import {CategoryKey, categoryStore} from '@src/entities/Category';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {quotesStore} from '@src/widgets/Quotes';
import {shareStore} from '@src/features/Share';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';

class HomePageStore {
  isHomePageLoading: boolean = true;
  homePageCategoryName: string = '';
  homePageCategoryKey: CategoryKey = CategoryKey.Starter; // first category

  constructor() {
    makeAutoObservable(this);
  }

  init = async (language: LanguageValueType) => {
    try {
      crashlytics().log('Fetching home page');

      runInAction(() => {
        this.isHomePageLoading = true;
      });
      await profileStore.fetchProfile();
      await categoriesStore.fetchCategories();
      await categoriesStore.fetchRubrics();
      await challengesStore.fetchChallengeCategories();
      // fetching books for quotes modal
      await booksStore.getBooks();
      quotesStore.checkQuotesShownStatus(booksStore.booksList);

      this.getHomePageCategory(language);

      shareStore.shareQuestionHandler(language);
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isHomePageLoading = false;
      });
    }
  };

  fetchHomePageCategoryChallenges = async () => {
    try {
      crashlytics().log('Fetching home page Challenges');

      runInAction(() => {
        this.isHomePageLoading = true;
      });

      await challengesStore.fetchChallengeCategories();
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isHomePageLoading = false;
      });
    }
  };

  fetchHomePageCategories = async (language: LanguageValueType) => {
    try {
      crashlytics().log('Fetching home page Categories');

      runInAction(() => {
        this.isHomePageLoading = true;
      });
      await profileStore.fetchProfile();
      await categoriesStore.fetchCategories();
      this.getHomePageCategory(language);
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isHomePageLoading = false;
      });
    }
  };

  getHomePageCategory = (language: LanguageValueType) => {
    try {
      const userCurrentCategoryKey = profileStore.currentCategory
        ?.currentCategory as CategoryKey;

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
      errorHandler({error: e});
    }
  };
}

export default new HomePageStore();
