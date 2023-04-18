import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {Collections} from '@src/shared/types/firebase';
import {categoryStore} from '@src/entities/Category';
import {rubricStore} from '@src/entities/Rubric';
import {favoriteStore} from '@src/entities/Favorite';
import {questionStore, QuestionType} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {QuestionsPageInfo} from '../types/questionTypes';

class QuestionsStore {
  questions: QuestionType[] = [];
  questionsPageInfo: QuestionsPageInfo = {} as QuestionsPageInfo;

  constructor() {
    makeAutoObservable(this);
  }

  getQuestionsPageInfo = async ({
    id,
    key,
  }: {
    id?: string;
    key: 'rubric' | 'category' | 'favorite';
  }) => {
    try {
      switch (key) {
        case 'rubric':
          if (!id) {
            return;
          }
          await this.fetchQuestionsById({
            id,
            key: 'rubricId',
          });
          this.rubricLogic({rubricId: id});
          break;
        case 'category':
          if (!id) {
            return;
          }
          await this.fetchQuestionsById({
            id,
            key: 'categoryId',
          });
          this.categoryLogic({categoryId: id});
          break;
        default:
          await this.fetchFavoritesQuestions();
          this.favoriteLogic();
      }
    } catch (e) {
      console.log(e);
    }
  };

  swipe = async ({
    question,
    key,
  }: {
    question: QuestionType;
    key: 'rubric' | 'category' | 'favorite';
  }) => {
    if (!question) {
      return;
    }

    switch (key) {
      case 'category':
        await firestore()
          .collection(Collections.CATEGORIES)
          .doc(question.categoryId)
          .update({
            currentQuestion: question.id,
          });
        this.categoryLogic({questionId: question.id});
        break;
      case 'rubric':
        await firestore()
          .collection(Collections.RUBRICS)
          .doc(question.rubricId)
          .update({
            currentQuestion: question.id,
          });
        this.rubricLogic({questionId: question.id});
        break;
      case 'favorite':
        const userId = userStore.authUser?.id;
        if (!userId) {
          return;
        }

        await firestore()
          .collection(Collections.USERS)
          .doc(userId)
          .update({
            favorites: {
              ...favoriteStore.favorite,
              currentQuestion: question.id,
            },
          });
        this.favoriteLogic(question.id);
        break;
      default:
    }
  };

  favoriteLogic = async (id?: string) => {
    try {
      let questionId = id;

      if (!id && favoriteStore.favorite) {
        questionId = favoriteStore.favorite.currentQuestion;
      }

      if (!questionId) {
        return;
      }

      const questionInfo = questionStore.getQuestionInfo({
        questionId: questionId,
        questions: this.questions,
      });
      if (!questionInfo) {
        return;
      }
      const {currentQuestion, currentQuestionIndex} = questionInfo;

      const currentRubric = rubricStore.getRubric(currentQuestion.rubricId);
      if (!currentRubric) {
        return;
      }

      const currentCategory = categoryStore.getCategory(
        currentQuestion.categoryId,
      );
      if (!currentCategory) {
        return;
      }

      this.setQuestionsPageInfo({
        questionsCount: this.questions.length,
        categoryName: currentCategory.name,
        rubricName: currentRubric.name,
        swipedQuestionsCount: currentQuestionIndex + 1,
        currentQuestion,
      });
    } catch (e) {
      console.log(e);
    }
  };

  rubricLogic = async ({
    rubricId,
    questionId,
  }: {
    rubricId?: string;
    questionId?: string;
  }) => {
    try {
      let currentquestionId = questionId;
      let rubricName: string | undefined;

      if (!questionId) {
        if (!rubricId) {
          return;
        }

        const rubric = rubricStore.getRubric(rubricId);
        currentquestionId = rubric?.currentQuestion;
        rubricName = rubric?.name;
      }
      if (!currentquestionId) {
        return;
      }

      const questionInfo = questionStore.getQuestionInfo({
        questionId: currentquestionId,
        questions: this.questions,
      });
      if (!questionInfo) {
        return;
      }
      const {currentQuestion, currentQuestionIndex} = questionInfo;

      const currentCategory = categoryStore.getCategory(
        currentQuestion?.categoryId,
      );
      if (!currentCategory) {
        return;
      }

      this.setQuestionsPageInfo({
        questionsCount: this.questions.length,
        categoryName: currentCategory.name,
        rubricName: rubricName || this.questionsPageInfo.rubricName,
        swipedQuestionsCount: currentQuestionIndex + 1,
        currentQuestion,
      });
    } catch (e) {
      console.log(e);
    }
  };

  categoryLogic = async ({
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

        const category = categoryStore.getCategory(categoryId);
        currentquestionId = category?.currentQuestion;
        categoryName = category?.name;
      }
      if (!currentquestionId) {
        return;
      }

      const questionInfo = questionStore.getQuestionInfo({
        questionId: currentquestionId,
        questions: this.questions,
      });
      if (!questionInfo) {
        return;
      }
      const {currentQuestion, currentQuestionIndex} = questionInfo;

      const currentRubric = rubricStore.getRubric(currentQuestion.rubricId);
      if (!currentRubric) {
        return;
      }

      this.setQuestionsPageInfo({
        questionsCount: this.questions.length,
        categoryName: categoryName || this.questionsPageInfo.categoryName,
        rubricName: currentRubric.name,
        swipedQuestionsCount: currentQuestionIndex + 1,
        currentQuestion,
      });
    } catch (e) {
      console.log(e);
    }
  };

  setQuestionsPageInfo = (info: Partial<QuestionsPageInfo>) => {
    try {
      runInAction(() => {
        this.questionsPageInfo = {
          ...this.questionsPageInfo,
          ...info,
        };
      });
    } catch (e) {
      console.log(e);
    }
  };

  fetchQuestionsById = async ({id, key}: {id: string; key: string}) => {
    try {
      const data = await firestore()
        .collection(Collections.QUESTIONS)
        .where(key, '==', id)
        .get();
      const questions = data.docs.map(question => ({
        ...question.data(),
        id: question.id,
      }));

      runInAction(() => {
        this.questions = questions as QuestionType[];
      });
    } catch (e) {
      console.log(e);
    }
  };

  fetchFavoritesQuestions = async () => {
    try {
      const favorites = favoriteStore.favorite;
      if (!favorites) {
        return;
      }

      const data = await firestore().collection(Collections.QUESTIONS).get();
      const questions = data.docs.map(question => ({
        ...question.data(),
        id: question.id,
      }));

      const favoritesQuestions = questions.filter(question => {
        return favorites.questions.includes(question.id);
      });

      runInAction(() => {
        this.questions = favoritesQuestions as QuestionType[];
      });
    } catch (e) {
      console.log(e);
    }
  };

  clearQuestionsInfo = () => {
    runInAction(() => {
      this.questions = [];
      this.questionsPageInfo = {} as QuestionsPageInfo;
    });
  };
}

export default new QuestionsStore();
