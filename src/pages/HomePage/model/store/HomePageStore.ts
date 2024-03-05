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
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {DocumentType} from '@src/shared/types/types';
import {userStore} from '@src/entities/User';
import {sessionStore} from '@src/entities/Session';
import {questionsStore} from '@src/pages/QuestionsPage';
import {Theme} from '@src/app/providers/themeProvider';
import {getPercentageFromNumber} from '@src/shared/lib/common';
import {specialDayStore} from '@src/entities/SpecialDay';
import {inAppPurchaseStore} from '@src/features/InAppPurchase';
import {rubricStore} from '@src/entities/Rubric';
import {goalStore} from '@src/entities/Goal';
import {getProgressBarImageGroups} from '../lib/homePage';

class HomePageStore {
  isHomePageLoading: boolean = true;

  quickStartCategoryName: string = '';
  progressBarCategoryName: string = '';
  progressBarCategoryKey: CategoryKey = CategoryKey.Starter;

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

      this.getHomePageCategory(language);

      const promise1 = questionsStore.fetchAllQuestionsInfo();
      const promise2 = challengesStore.fetchChallengeCategories();
      const promise3 = this.fetchBooksAndCheckQuotesShownStatus();
      const promise4 = this.fetchHomePageSessions();
      const promise5 = rubricStore.fetchRubrics();
      const promise6 = specialDayStore.fetchSpecialDays();
      const promise7 = inAppPurchaseStore.checkIfUserHasSubscription();

      await Promise.all([
        promise1,
        promise2,
        promise3,
        promise4,
        promise5,
        promise6,
        promise7,
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
      await this.fetchHomePageSessions();
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

  fetchHomePageSessions = async () => {
    crashlytics().log('Fetching home page Sessions');

    // fetching sessions for action banner
    await sessionStore.fetchSessions();
    this.setCurrentSession();
  };

  fetchHomePageCategories = async (language: LanguageValueType) => {
    crashlytics().log('Fetching home page Categories');

    await categoriesStore.fetchCategories();
    this.getHomePageCategory(language);
  };

  setCurrentSession = () => {
    const homePageCategory = this.homePageCategory;
    if (!homePageCategory) {
      return;
    }

    sessionStore.getAndSetSession(homePageCategory.currentSession);
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

      // Hot and All in One categories should not show up in the progress bar
      if (
        userCurrentCategoryKey === CategoryKey.All_In_One ||
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
        this.quickStartCategoryName = quickStartCategoryName;
        this.progressBarCategoryName = progressBarCategoryName;
        this.homePageCategory = homePageCategory;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  goToQuestionsPage = ({
    isFirstUserVisit,
    language,
  }: {
    isFirstUserVisit: boolean;
    language: LanguageValueType;
  }) => {
    try {
      crashlytics().log('User clicked quick start button.');

      const homePageCategory = this.homePageCategory;
      if (!homePageCategory) {
        return;
      }

      if (!isFirstUserVisit) {
        navigation.navigate(AppRouteNames.QUESTIONS, {
          type: DocumentType.CATEGORY,
          id: homePageCategory.id,
          showPreSessionPopup: true,
        });

        return;
      }

      const isCategoryDetailsVisible =
        homePageCategory.isCategoryDetailsVisible;

      if (isCategoryDetailsVisible) {
        navigation.navigate(AppRouteNames.CATEGORY_DETAILS, {
          title: homePageCategory.displayName[language],
        });
      } else {
        navigation.navigate(AppRouteNames.SESSIONS, {
          type: DocumentType.CATEGORY,
          title: homePageCategory.displayName[language],
          id: homePageCategory.id,
        });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getProgressBarImage = (theme: Theme) => {
    try {
      const progressBarCategoryKey = this.progressBarCategoryKey;
      const sessions = sessionStore.allSessions;
      const unlockedSessions = sessions.filter(item => !item.isBlocked);

      const progressBarImgGroups = getProgressBarImageGroups({
        category: progressBarCategoryKey,
        isDarkMode: theme === Theme.Dark,
      });

      const passedSessionsPercentage = getPercentageFromNumber(
        unlockedSessions.length,
        sessions.length,
      );

      const imgKey = this.getImageKeyByPercentage(passedSessionsPercentage);

      runInAction(() => {
        this.progressBarImg = progressBarImgGroups[imgKey];
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getImageKeyByPercentage = (passedSessionsPercentage: number) => {
    if (passedSessionsPercentage < 25) {
      return 0;
    }

    if (passedSessionsPercentage >= 25 && passedSessionsPercentage < 50) {
      return 1;
    }

    if (passedSessionsPercentage >= 50 && passedSessionsPercentage < 80) {
      return 2;
    }

    return 3;
  };
}

export default new HomePageStore();
