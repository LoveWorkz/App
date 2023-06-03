import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {categoriesStore} from '@src/pages/CategoriesPage';
import {profileStore} from '@src/entities/Profile';
import {challengesStore} from '@src/pages/ChallengesPage';
import {booksStore} from '@src/pages/BooksPage';
import {CategoryKey, categoryStore, CategoryType} from '@src/entities/Category';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {quotesStore} from '@src/widgets/Quotes';
import {shareStore} from '@src/features/Share';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {DocumentType} from '@src/shared/types/types';
import {getNumberFromPercentage} from '@src/shared/lib/common';

class HomePageStore {
  isHomePageLoading: boolean = true;

  quickStartCategoryName: string = '';
  progressBarCategoryName: string = '';
  progressBarCategoryKey: CategoryKey = CategoryKey.Starter; // first category
  quickStartCategoryKey: CategoryKey = CategoryKey.Starter; // first category

  homePageCategory: CategoryType | null = null;
  homePageCategoryQuestionsSize: number = 0;
  currentQuestionNumber: number = 0;

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

      let homePageCategory = category;
      let quickStartCategoryName = category.displayName[language];
      let quickStartCategoryKey = userCurrentCategoryKey;
      let progressBarCategoryName = quickStartCategoryName;
      let progressBarCategoryKey = quickStartCategoryKey;

      const homePageCategoryQuestionsSize = homePageCategory.questions.length;
      const currentQuestionNumber = this.getHomePageQuestionNumber({
        homePageCategory,
        homePageCategoryQuestionsSize,
      });

      // Hot and All in One categories should not show up in the progress bar
      if (
        userCurrentCategoryKey === CategoryKey.All_In_One ||
        userCurrentCategoryKey === CategoryKey.Hot
      ) {
        const intimateCategory = categoryStore.getCategoryByName(
          CategoryKey.Intimate,
        );

        if (!intimateCategory) {
          return;
        }

        progressBarCategoryName = intimateCategory.displayName[language];
        progressBarCategoryKey = CategoryKey.Intimate;
      }

      runInAction(() => {
        this.progressBarCategoryKey = progressBarCategoryKey;
        this.quickStartCategoryName = quickStartCategoryName;
        this.progressBarCategoryName = progressBarCategoryName;
        this.quickStartCategoryKey = quickStartCategoryKey;

        this.homePageCategory = homePageCategory;
        this.currentQuestionNumber = currentQuestionNumber;
        this.homePageCategoryQuestionsSize = homePageCategoryQuestionsSize;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getHomePageQuestionNumber = ({
    homePageCategory,
    homePageCategoryQuestionsSize,
  }: {
    homePageCategory: CategoryType;
    homePageCategoryQuestionsSize: number;
  }) => {
    const numberFromPercentage = Math.ceil(
      getNumberFromPercentage(
        homePageCategory.swipedQuestionsPercentage,
        homePageCategoryQuestionsSize,
      ),
    );

    //if it's the first question set 1
    return numberFromPercentage || 1;
  };

  goToQuestionsPage = async () => {
    try {
      crashlytics().log('User clicked quick start button.');

      const homePageCategory = this.homePageCategory;
      if (!homePageCategory) {
        return;
      }

      navigation.navigate(AppRouteNames.QUESTIONS, {
        type: DocumentType.CATEGORY,
        id: homePageCategory.id,
      });
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isHomePageLoading = false;
      });
    }
  };
}

export default new HomePageStore();
