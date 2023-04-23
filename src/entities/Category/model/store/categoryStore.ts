import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {categoriesStore} from '@src/pages/CategoriesPage';
import {Collections} from '@src/shared/types/firebase';
import {questionStore} from '@src/entities/QuestionCard';
import {questionsStore} from '@src/pages/QuestionsPage';
import {rubricStore} from '@src/entities/Rubric';
import {CategoryType} from '../types/categoryTypes';

class CategoryStore {
  category: CategoryType | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchCategory = async (id: string) => {
    try {
      const data = await firestore()
        .collection(Collections.CATEGORIES)
        .doc(id)
        .get();

      const category = {...data.data(), id: data.id} as CategoryType;

      runInAction(() => {
        this.category = category;
      });
      return category;
    } catch (e) {
      console.log(e);
    }
  };

  updateCategory = async ({
    id,
    field,
    data,
  }: {
    id: string;
    field: string;
    data: number | string | boolean;
  }) => {
    try {
      await firestore()
        .collection(Collections.CATEGORIES)
        .doc(id)
        .update({
          [field]: data,
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

  categorySwipeLogic = async ({
    categoryId,
    questionId,
  }: {
    categoryId?: string;
    questionId?: string;
  }) => {
    try {
      let currentquestionId = questionId;
      let categoryName: string | undefined;

      if (!questionId) {
        if (!categoryId) {
          return;
        }

        const category = await this.getCategory(categoryId);
        currentquestionId = category?.currentQuestion;
        categoryName = category?.name;
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
        rubricName: currentRubric.name,
        swipedQuestionsCount: currentQuestionIndex + 1,
        currentQuestion,
      });
    } catch (e) {
      console.log(e);
    }
  };
}

export default new CategoryStore();
