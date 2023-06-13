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
import {CategoryKey, CategoryType} from '../types/categoryTypes';

class CategoryStore {
  category: CategoryType | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  initUserCategoryQuestionId = async ({
    questions,
    id,
  }: {
    questions: QuestionType[];
    id: string;
  }) => {
    try {
      if (this.category?.currentQuestion) {
        return;
      }

      const firstQuestion = questions[0];

      await userCategoryStore.updateUserCategory({
        id,
        field: 'currentQuestion',
        data: firstQuestion.id,
      });
      runInAction(() => {
        this.category = {
          ...this.category,
          currentQuestion: firstQuestion.id,
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
        .collection(Collections.CATEGORIES)
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

      runInAction(() => {
        this.category = category;
      });
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

      runInAction(() => {
        this.category = category;
      });
    } catch (e) {
      errorHandler({error: e});
    } finally {
    }
  };

  getCategory = (id: string) => {
    try {
      return categoriesStore.categories.find(category => {
        return category.id === id;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getIsLastCategory = () => {
    try {
      const currentCategory = this.category;
      if (!currentCategory) {
        return;
      }
      const lastCategoryKey = CategoryKey.All_In_One;
      const isLastCategoryKey = currentCategory.name === lastCategoryKey;
      return isLastCategoryKey;
    } catch (e) {
      errorHandler({error: e});
      return false;
    }
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
    initialQuestionId,
  }: {
    language: LanguageValueType;
    questions: QuestionType[];
    questionId?: string;
    initialQuestionId?: string;
  }) => {
    try {
      let currentquestionId = questionId;
      let categoryName: string | undefined;
      let isInitialSetUp = !questionId;

      if (initialQuestionId) {
        currentquestionId = initialQuestionId;
        isInitialSetUp = true;
      }

      // it's working only for the first time
      if (isInitialSetUp) {
        const category = this.category;

        if (!category) {
          return;
        }

        currentquestionId = initialQuestionId || category.currentQuestion;
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

      // if a user swipe some question show quick start block in the home page
      if (currentQuestionNumber > 1) {
        userStore.updateUser({
          field: 'hasUserSwipedAnyQuestion',
          data: true,
        });
      }

      const currentRubric = rubricStore.getRubric(currentQuestion.rubricId);
      if (!currentRubric) {
        return;
      }

      if (isInitialSetUp) {
        questionStore.setQuestionPreviewInfo({
          ...questionStore.questionPreviewInfo,
          defaultQuestionNumber: currentQuestionNumber,
        });
      }

      questionStore.setQuestionPreviewInfo({
        categoryName:
          categoryName || questionStore.questionPreviewInfo.categoryName,
        rubricName: currentRubric.displayName[language],
        questionNumber: currentQuestionNumber,
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new CategoryStore();
