import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {categoriesStore} from '@src/pages/CategoriesPage';
import {Collections} from '@src/shared/types/firebase';
import {questionStore, QuestionType} from '@src/entities/QuestionCard';
import {questionsStore} from '@src/pages/QuestionsPage';
import {rubricStore} from '@src/entities/Rubric';
import {userStore} from '@src/entities/User';
import {CategoryType} from '../types/categoryTypes';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';

class CategoryStore {
  category: CategoryType | null = null;
  isCategoryDetailsPageLoading: boolean = true;

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

      await this.updateUserCategory({
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
      console.log(e);
    }
  };

  fetchCategory = async ({id}: {id: string}) => {
    try {
      const userId = userStore.authUserId;
      if (!userId) {
        return;
      }

      runInAction(() => {
        this.isCategoryDetailsPageLoading = true;
      });

      // default category
      const categoryData = await firestore()
        .collection(Collections.CATEGORIES)
        .doc(id)
        .get();
      // user custom category
      const userCategoryData = await firestore()
        .collection(Collections.USER_CATEGORIES)
        .doc(userId)
        .get();

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
      console.log(e);
    } finally {
      runInAction(() => {
        this.isCategoryDetailsPageLoading = false;
      });
    }
  };

  updateUserCategory = async ({
    field,
    id,
    data,
  }: {
    id: string;
    field: string;
    data: number | string | boolean;
  }) => {
    try {
      const userId = userStore.authUserId;
      if (!userId) {
        return;
      }

      await firestore()
        .collection(Collections.USER_CATEGORIES)
        .doc(userId)
        .update({
          [`categories.${id}.${field}`]: data,
        });
    } catch (e) {
      console.log(e);
    }
  };

  getCategory = (id: string) => {
    try {
      return categoriesStore.categories.find(category => {
        return category.id === id;
      });
    } catch (e) {
      console.log(e);
    }
  };

  getCategoryByName = (name: string) => {
    try {
      return categoriesStore.categories.find(category => {
        return category.name === name;
      });
    } catch (e) {
      console.log(e);
    }
  };

  categorySwipeLogic = async ({
    questionId,
    language,
  }: {
    categoryId?: string;
    questionId?: string;
    language: LanguageValueType;
  }) => {
    try {
      let currentquestionId = questionId;
      let categoryName: string | undefined;

      if (!questionId) {
        const category = this.category;

        if (!category) {
          return;
        }

        currentquestionId = category.currentQuestion;
        categoryName = category.displayName[language as LanguageValueType];
      }

      if (!currentquestionId) {
        return;
      }

      const questionInfo = questionStore.getQuestionInfo({
        questionId: currentquestionId,
        questions: questionsStore.questions,
      });
      if (!questionInfo) {
        return;
      }
      const {currentQuestion, currentQuestionIndex} = questionInfo;

      const currentRubric = rubricStore.getRubric(currentQuestion.rubricId);
      if (!currentRubric) {
        return;
      }

      questionsStore.setQuestionsPageInfo({
        questionsCount: questionsStore.questions.length,
        categoryName:
          categoryName || questionsStore.questionsPageInfo.categoryName,
        rubricName: currentRubric.displayName[language],
        swipedQuestionsCount: currentQuestionIndex + 1,
        currentQuestion,
      });
    } catch (e) {
      console.log(e);
    }
  };
}

export default new CategoryStore();
