import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {categoriesStore} from '@src/pages/CategoriesPage';
import {Collections} from '@src/shared/types/firebase';
import {questionStore, QuestionType} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {userCategoryStore} from '@src/entities/UserCategory';
import {DocumentType} from '@src/shared/types/types';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {getNextElementById} from '@src/shared/lib/common';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {specialDayStore} from '@src/entities/SpecialDay';
import {sessionStore, SessionType} from '@src/entities/Session';
import {challengeStore} from '@src/entities/Challenge';
import {userChallengeCategoryStore} from '@src/entities/UserChallengeCategory';
import {CategoryKey, CategoryType} from '../types/categoryTypes';
import {FIRST_LEVEL_ID} from '../lib/category';

class CategoryStore {
  category: CategoryType | null = null;
  lastCategoryId: string = '';
  isSpecialCategoryBlocked: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setLastCategoryId = (categoryId: string) => {
    this.lastCategoryId = categoryId;
  };

  setIsSpecialCategoryBlocked = (isBlocked: boolean) => {
    this.isSpecialCategoryBlocked = isBlocked;
  };

  // Initializes the current question for a session if not already set.
  async initSessionQuestion({
    questions,
    session,
    levelId,
  }: {
    questions: QuestionType[];
    session: SessionType;
    levelId: string;
  }) {
    try {
      const firstQuestion = questions[0];

      // Check if the current question is already set in the session.
      if (session.currentQuestion) {
        return;
      }

      // Update the session with the first question ID in the firestore.
      await userCategoryStore.updateUserSessions([
        {
          sessionId: session.id,
          levelId,
          updates: {
            currentQuestion: firstQuestion.id,
          },
        },
      ]);

      // Update the current session in the local store.
      const updatedSession = {...session, currentQuestion: firstQuestion.id};
      sessionStore.setSession(updatedSession);
    } catch (error) {
      errorHandler({error});
    }
  }

  fetchLevel = async ({id}: {id: string}) => {
    try {
      crashlytics().log('Fetching Level.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();
      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      const promise1 = firestore()
        .collection(Collections.LEVELS)
        .doc(id)
        .get({source});

      const promise2 = firestore()
        .collection(Collections.USER_LEVELS)
        .doc(userId)
        .collection(Collections.LEVELS)
        .doc(id)
        .get({source});

      const [defaultLevelData, userLevelData] = await Promise.all([
        promise1,
        promise2,
      ]);

      const userLevel = userLevelData.data();
      if (!userLevel) {
        return;
      }

      const currentLevel = defaultLevelData.data() as CategoryType;

      // merge default level with user custom level
      const level = {
        ...currentLevel,
        id: defaultLevelData.id,
        name: currentLevel.name,
        ...userLevel,
      } as CategoryType;

      this.setCategory(level);
      return level;
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getAndSetCategory = ({id}: {id: string}) => {
    try {
      const category = this.getCategory(id);
      if (!category) {
        return;
      }

      this.setCategory(category);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getNextCategory = (id?: string) => {
    if (!id) {
      return null;
    }

    const nextCategory = getNextElementById<CategoryType>({
      id,
      array: categoriesStore.categories,
    });

    return nextCategory;
  };

  setCategory = (category: CategoryType) => {
    this.category = category;
  };

  categoryPressHandler = ({
    isActionDisabled,
    isCategoryDetailsVisible,
    displayName,
    categoryId,
    key,
  }: {
    isActionDisabled?: boolean;
    isCategoryDetailsVisible: Boolean;
    displayName: string;
    categoryId: string;
    key: CategoryKey;
  }) => {
    try {
      if (isActionDisabled) {
        return;
      }

      if (key === CategoryKey.How_To_Use) {
        navigation.navigate(AppRouteNames.HOW_TO_USE);
        return;
      }

      this.getAndSetCategory({id: categoryId});

      if (isCategoryDetailsVisible) {
        navigation.navigate(AppRouteNames.CATEGORY_DETAILS, {
          title: displayName,
        });
      } else {
        navigation.navigate(AppRouteNames.SESSIONS, {
          type: DocumentType.CATEGORY,
          id: categoryId,
        });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getCategory = (id: string) => {
    return categoriesStore.categories.find(category => {
      return category.id === id;
    });
  };

  getCategoryByName = (name?: string): CategoryType => {
    const levels = categoriesStore.categories;
    const firstLevel = levels[0];

    if (!name) {
      return firstLevel;
    }

    const level = levels.find(l => {
      return l.name === name;
    });
    return level || firstLevel;
  };

  isFirstLevel = (levelId: string) => {
    return levelId === FIRST_LEVEL_ID;
  };

  getQuestionSwipeInfoForCategory = ({
    questionId,
    questions,
    sharedQuestionId,
    setIsGradient,
  }: {
    questions: QuestionType[];
    questionId?: string;
    sharedQuestionId?: string;
    setIsGradient: (isGradient: boolean) => void;
  }) => {
    try {
      let currentquestionId = questionId;
      let isInitialSetUp = !questionId;

      // if a user opened a shared link
      if (sharedQuestionId) {
        currentquestionId = sharedQuestionId;
        isInitialSetUp = true;
      }

      // it's working only for the first time
      if (isInitialSetUp) {
        const session = sessionStore.session;
        if (!session) {
          return;
        }

        currentquestionId = sharedQuestionId || session.currentQuestion;
      }

      if (!currentquestionId) {
        return;
      }

      const questionInfo = questionStore.getQuestionInfo({
        questionId: currentquestionId,
        questions: questions,
      });

      if (!questionInfo) {
        return;
      }
      const {currentQuestion, currentQuestionNumber} = questionInfo;

      // Check if the current question is of type 'WILD_CARD'. If so, enable the gradient background.
      const isTypeWild = currentQuestion.type === 'WILD_CARD';
      setIsGradient(isTypeWild);

      if (isInitialSetUp) {
        questionStore.setDefaultQuestionNumber(currentQuestionNumber);
      }

      questionStore.setQuestion(currentQuestion);

      // if a user swipe some question show quick start block in the home page
      if (currentQuestionNumber > 1) {
        userStore.updateUser({
          field: 'hasUserSwipedAnyQuestion',
          data: true,
        });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  checkContentLock = (categoryKey: CategoryKey) => {
    try {
      const hasUserSubscription = userStore.getUserHasSubscription();
      const isStarter = categoryKey === CategoryKey.Starter;

      if (isStarter) {
        return false;
      }

      const isContentLocked = !hasUserSubscription;
      return isContentLocked;
    } catch (e) {
      errorHandler({error: e});
      return false;
    }
  };

  checkIfSpecialDateAndUpdateSpecialCategory = async (
    specialCategoryId: string,
  ): Promise<void> => {
    try {
      const specialCategory =
        categoriesStore.displayedLevelsMap[specialCategoryId];
      const shouldBlock = await this.shouldBlockCategory(specialCategory);
      const shouldUnlock = await this.shouldUnlockCategory(specialCategory);

      if (shouldBlock) {
        this.setIsSpecialCategoryBlocked(true);
      }

      if (shouldUnlock) {
        this.setIsSpecialCategoryBlocked(false);
      }
    } catch (error) {
      errorHandler({error});
    }
  };

  editCategory = async ({
    categoryId,
    isBlocked,
  }: {
    categoryId: string;
    isBlocked: boolean;
  }) => {
    await userCategoryStore.updateUserLevels([
      {
        levelId: categoryId,
        updates: {
          isBlocked,
        },
      },
    ]);

    const categories = categoriesStore.categories;

    const newCategories = categories.map(category => {
      if (category.id === categoryId) {
        return {...category, isBlocked};
      }

      return category;
    });

    categoriesStore.setCategories(newCategories);
  };

  shouldBlockCategory = async (category: CategoryType) => {
    const isSpecialDay = await specialDayStore.isTodaySpecial();

    if (!isSpecialDay && !category.isBlocked) {
      return true;
    }

    return false;
  };

  shouldUnlockCategory = async (category: CategoryType) => {
    const isSpecialDay = await specialDayStore.isTodaySpecial();

    if (isSpecialDay && category.isBlocked) {
      return true;
    }

    return false;
  };

  getLevelNumberById = (levels: CategoryType[], id: string) => {
    const levelNumber = levels.findIndex(level => level.id === id);
    return levelNumber === -1 ? 1 : levelNumber + 1;
  };

  isLastLevel = (categoryKey: CategoryKey) => {
    return categoryKey === CategoryKey.Intimate;
  };

  updateLevels = ({
    levelId,
    field,
    value,
  }: {
    levelId: string;
    field: string;
    value: string | number | boolean;
  }) => {
    const levels = categoriesStore.categories;

    const newLevels = levels.map(level => {
      if (level.id === levelId) {
        return {...level, [field]: value};
      }

      return level;
    });

    runInAction(() => {
      categoriesStore.setCategories(newLevels);
    });
  };

  // Updates user data and progresses to the next level after all questions have been swiped.
  async updateUserLevelAftePassedAllSessionsAndQuadrats({
    level,
    session,
  }: {
    level: CategoryType;
    session: SessionType;
  }) {
    try {
      crashlytics().log(
        'Attempting to update user data after all questions are swiped.',
      );

      // Check user subscription before proceeding.
      if (!userStore.getUserHasSubscription()) {
        console.log('User does not have an active subscription.');
        return;
      }

      // Special challenge handling.
      if (session.challenge.isChallengeSpecial) {
        await this.updateChallenge(session.challenge.challengeId);
      }

      // Early exit if no updates are necessary.
      if (this.isLastLevel(level.name)) {
        console.log('No further updates required. Either last level passed.');
        return;
      }

      // Determine the next level to transition to.
      const nextLevel = this.getNextLevel(level.id);
      if (!nextLevel || !nextLevel.isBlocked) {
        console.log('No need to update next level.');
        return;
      }

      // Update the current level in the user store and prepare updates.
      userStore.setCurrentLevel({currentCategory: nextLevel.name});
      const updates = this.prepareLevelUpdates(level, nextLevel);

      // Execute all updates.
      await Promise.all(updates);
    } catch (error) {
      errorHandler({
        error: error,
        message: 'Failed to update user data after all questions were swiped.',
      });
    }
  }

  // Helper to update challenge information.
  async updateChallenge(challengeId: string) {
    await challengeStore.updateSpecialChallenge({
      id: challengeId,
      value: false,
      field: 'isBlocked',
    });
  }

  // Helper to fetch the next level.
  getNextLevel(currentLevelId: string): CategoryType | null {
    const levels = categoriesStore.categories;
    return getNextElementById<CategoryType>({
      id: currentLevelId,
      array: levels,
    });
  }

  // Prepare batch updates for levels and other related information.
  prepareLevelUpdates(
    currentLevel: CategoryType,
    nextLevel: CategoryType,
  ): Promise<any>[] {
    const updateCurrentLevel = userCategoryStore.updateUserLevels([
      {
        levelId: nextLevel.id,
        updates: {isBlocked: false},
      },
    ]);

    const updateCategory = userStore.updateUser({
      field: 'category.currentCategory',
      data: nextLevel.name,
    });

    const updateQuadrant = sessionStore.findAndUpdateNextLevelQuadrant({
      levelId: currentLevel.id,
      nextLevelId: nextLevel.id,
    });

    const updateSession =
      sessionStore.findAndUpdateFirstSessionInTheNextCategory({
        level: currentLevel,
        nextLevel,
      });

    const updateChallengeCategory =
      userChallengeCategoryStore.updateUserChallengeCategory({
        field: 'isBlocked',
        data: false,
        challengeCategoryName: nextLevel.name,
      });

    const setFinishDate = userStore.setNotification({
      field: 'lastSessionDate',
      value: new Date(),
    });

    return [
      updateCurrentLevel,
      updateCategory,
      updateQuadrant,
      updateSession,
      updateChallengeCategory,
      setFinishDate,
    ];
  }
}

export default new CategoryStore();
