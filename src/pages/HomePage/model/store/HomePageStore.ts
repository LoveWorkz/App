import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {categoriesStore} from '@src/pages/CategoriesPage';
import {challengesStore} from '@src/pages/ChallengesPage';
import {booksStore} from '@src/pages/BooksPage';
import {CategoryKey, categoryStore, CategoryType} from '@src/entities/Category';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {quotesStore} from '@src/widgets/Quotes';
import {shareStore} from '@src/features/Share';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {userStore} from '@src/entities/User';
import {QuadrantKey, QuadrantType, sessionStore} from '@src/entities/Session';
import {questionsStore} from '@src/pages/QuestionsPage';
import {Theme} from '@src/app/providers/themeProvider';
import {specialDayStore} from '@src/entities/SpecialDay';
import {inAppPurchaseStore} from '@src/features/InAppPurchase';
import {rubricStore} from '@src/entities/Rubric';
import {goalStore} from '@src/entities/Goal';
import {notificationStore} from '@src/entities/Notification';
import {getProgressBarImageGroups} from '../lib/homePage';

class HomePageStore {
  isHomePageLoading: boolean = true;

  progressBarCategoryName: string = '';
  progressBarCategoryKey: CategoryKey = CategoryKey.Starter;
  homePageQuadrantName: string = '';
  homePageQuadrantKey: QuadrantKey = 'personal_growth';

  homePageCategory: CategoryType | null = null;
  progressBarImg: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  init = async (language: LanguageValueType) => {
    try {
      crashlytics().log('Fetching home page');

      runInAction(() => {
        this.isHomePageLoading = true;
      });

      await userStore.fetchUser();
      await categoriesStore.fetchCategories();
      await rubricStore.fetchRubrics();

      this.getHomePageCategory(language);

      const promise1 = questionsStore.fetchAllQuestionsInfo();
      const promise2 = challengesStore.fetchChallengeCategories();
      const promise3 = this.fetchBooksAndCheckQuotesShownStatus();
      const promise4 = this.getHomePageQuadrants(language);
      const promise5 = specialDayStore.fetchSpecialDays();
      const promise6 = inAppPurchaseStore.checkIfUserHasSubscription();

      await Promise.all([
        promise1,
        promise2,
        promise3,
        promise4,
        promise5,
        promise6,
      ]);

      shareStore.shareQuestionHandler(language);
      userStore.setInited(true);
      goalStore.initSelectedGoalsIds();
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isHomePageLoading = false;
      });
    }
  };

  fetchBooksAndCheckQuotesShownStatus = async () => {
    // fetching books for quotes modal
    const books = await booksStore.fetchBooks();
    // receive notifications from the storage and place them in the database
    await notificationStore.initUserNotifications();

    quotesStore.checkQuotesShownStatus(books);
  };

  fetchHomePageCategoriesAndChallenges = async (
    language: LanguageValueType,
  ) => {
    try {
      runInAction(() => {
        this.isHomePageLoading = true;
      });

      await userStore.fetchUser();
      await this.fetchHomePageCategoryChallenges();
      await this.fetchHomePageCategories(language);
      await this.getHomePageQuadrants(language);
    } catch (e) {
      errorHandler({error: e});
    } finally {
      runInAction(() => {
        this.isHomePageLoading = false;
      });
    }
  };

  fetchHomePageCategoryChallenges = async () => {
    crashlytics().log('Fetching home page Challenges');

    await challengesStore.fetchChallengeCategories();
  };

  getHomePageQuadrants = async (language: LanguageValueType) => {
    crashlytics().log('Fetching home page Quadrants');

    const level = categoryStore.category;
    if (level) {
      await sessionStore.fetchQuadrants(level.id);
      const currentQuadrant = sessionStore.getCurrentQuadrant();

      if (!currentQuadrant) {
        return;
      }

      this.setHomePageQuadrantInfo(currentQuadrant, language);
    }
  };

  setHomePageQuadrantInfo = (
    quadrant: QuadrantType,
    language: LanguageValueType,
  ) => {
    this.homePageQuadrantName = quadrant.displayName[language];
    this.homePageQuadrantKey = quadrant.key;
  };

  fetchHomePageCategories = async (language: LanguageValueType) => {
    crashlytics().log('Fetching home page Categories');

    await categoriesStore.fetchCategories();
    this.getHomePageCategory(language);
  };

  getHomePageCategory = (language: LanguageValueType) => {
    try {
      const userCurrentCategoryKey = userStore.currentCategory
        ?.currentCategory as CategoryKey;
      if (!userCurrentCategoryKey) {
        return;
      }

      const category = categoryStore.getCategoryByName(userCurrentCategoryKey);
      if (!category) {
        return;
      }

      let homePageCategory = category;
      categoryStore.setCategory(homePageCategory);

      let quickStartCategoryName = category.displayName[language];
      let progressBarCategoryName = quickStartCategoryName;
      let progressBarCategoryKey = userCurrentCategoryKey;

      // Hot and How To Use should not show up in the progress bar
      if (
        userCurrentCategoryKey === CategoryKey.How_To_Use ||
        userCurrentCategoryKey === CategoryKey.Specials
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
        this.progressBarCategoryName = quickStartCategoryName;
        this.homePageCategory = homePageCategory;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getProgressBarImage = (theme: Theme) => {
    try {
      const progressBarCategoryKey = this.progressBarCategoryKey;
      const homePageQuadrantKey = this.homePageQuadrantKey;

      const progressBarImgGroups = getProgressBarImageGroups({
        category: progressBarCategoryKey,
        isDarkMode: theme === Theme.Dark,
      });

      runInAction(() => {
        this.progressBarImg = progressBarImgGroups[homePageQuadrantKey];
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new HomePageStore();
