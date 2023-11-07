import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {categoriesStore} from '@src/pages/CategoriesPage';
import {Collections} from '@src/shared/types/firebase';
import {questionStore, QuestionType} from '@src/entities/QuestionCard';
import {rubricStore} from '@src/entities/Rubric';
import {userStore} from '@src/entities/User';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {userCategoryStore} from '@src/entities/UserCategory';
import {DocumentType} from '@src/shared/types/types';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {getNextElementById} from '@src/shared/lib/common';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {CategoryKey, CategoryType} from '../types/categoryTypes';

class CategoryStore {
  category: CategoryType | null = null;
  lastCategoryId: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setLastCategoryId = (categoryId: string) => {
    this.lastCategoryId = categoryId;
  };

  initUserCategoryQuestionId = async ({
    questions,
    id,
    sessionId,
  }: {
    questions: QuestionType[];
    id: string;
    sessionId: string;
  }) => {
    try {
      const category = this.category;
      if (!category) {
        return;
      }

      // if currentQuestion is empty set initial currentQuestion
      const currentQuestion = category.sessions[sessionId].currentQuestion;
      if (currentQuestion) {
        return;
      }

      const firstQuestion = questions[0];

      await userCategoryStore.updateUserCategory({
        id,
        field: `sessions.${sessionId}.currentQuestion`,
        data: firstQuestion.id,
      });
      runInAction(() => {
        this.category = {
          ...this.category,
          currentQuestion: firstQuestion.id,
          sessions: {
            [sessionId]: {
              currentQuestion: firstQuestion.id,
            },
          },
        } as CategoryType;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchCategory = async ({id}: {id: string}) => {
    try {
      crashlytics().log('Fetching Category.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();
      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      // default category
      const categoryData = await firestore()
        .collection(Collections.CATEGORIES_2)
        .doc(id)
        .get({source});
      // user custom category
      const userCategoryData = await firestore()
        .collection(Collections.USER_CATEGORIES)
        .doc(userId)
        .get({source});

      const userCategory = userCategoryData.data();
      if (!userCategory) {
        return;
      }

      const currentCategory = categoryData.data() as CategoryType;

      // merge default category with user custom category
      const category = {
        ...currentCategory,
        id: categoryData.id,
        name: currentCategory.name,
        ...userCategory.categories[id],
      } as CategoryType;

      this.setCategory(category);
      return category;
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
  }: {
    isActionDisabled?: boolean;
    isCategoryDetailsVisible: Boolean;
    displayName: string;
    categoryId: string;
  }) => {
    try {
      if (isActionDisabled) {
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
          title: displayName,
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

  getIsLastCategoryByKey = (categoryKey: CategoryKey) => {
    return categoryKey === CategoryKey.All_In_One;
  };

  getCategoryByName = (name: string) => {
    try {
      return categoriesStore.categories.find(category => {
        return category.name === name;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getQuestionSwipeInfoForCategory = ({
    questionId,
    language,
    questions,
    sharedQuestionId,
    sessionId,
  }: {
    language: LanguageValueType;
    questions: QuestionType[];
    questionId?: string;
    sharedQuestionId?: string;
    sessionId: string;
  }) => {
    try {
      let currentquestionId = questionId;
      let categoryName: string | undefined;
      let isInitialSetUp = !questionId;

      // if a user opened a shared link
      if (sharedQuestionId) {
        currentquestionId = sharedQuestionId;
        isInitialSetUp = true;
      }

      // it's working only for the first time
      if (isInitialSetUp) {
        const category = this.category;
        if (!category) {
          return;
        }

        currentquestionId =
          sharedQuestionId || category.sessions[sessionId].currentQuestion;
        categoryName = category.displayName[language as LanguageValueType];
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

      questionStore.setQuestion(currentQuestion);

      // if a user swipe some question show quick start block in the home page
      if (currentQuestionNumber > 1) {
        userStore.updateUser({
          field: 'hasUserSwipedAnyQuestion',
          data: true,
        });
      }

      const currentRubric = rubricStore.getRubric(currentQuestion.rubricId);

      if (isInitialSetUp) {
        questionStore.setQuestionPreviewInfo({
          ...questionStore.questionPreviewInfo,
          defaultQuestionNumber: currentQuestionNumber,
        });
      }

      questionStore.setQuestionPreviewInfo({
        categoryName:
          categoryName || questionStore.questionPreviewInfo.categoryName,
        rubricName: currentRubric?.displayName[language] || '',
        questionNumber: currentQuestionNumber,
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new CategoryStore();
