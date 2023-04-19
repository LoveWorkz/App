import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {Collections} from '@src/shared/types/firebase';
import {
  CategoryName,
  categoryStore,
  CategoryType,
  getNextCategoryName,
} from '@src/entities/Category';
import {rubricStore, RubricType} from '@src/entities/Rubric';
import {favoriteStore} from '@src/entities/Favorite';
import {questionStore, QuestionType} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {minutesDiff} from '@src/shared/lib/date';
import {profileStore} from '@src/entities/Profile';
import {getPercentageFromNumber} from '@src/shared/lib/common';
import {QuestionsPageInfo} from '../types/questionTypes';
import {breakPoint, minute} from '../lib/questions';

class QuestionsStore {
  questions: QuestionType[] = [];
  questionsPageInfo: QuestionsPageInfo = {} as QuestionsPageInfo;
  thatWasFastModalVisible: boolean = false;
  congratsModalVisible: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setThatWasFastModalVisible = (isVisible: boolean) => {
    this.thatWasFastModalVisible = isVisible;
  };

  setCongratsModalVisible = (isVisible: boolean) => {
    this.congratsModalVisible = isVisible;
  };

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

        const category = await categoryStore.getCategory(categoryId);
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

  // wow that was fast logic

  setQuestionsSwipedInfo = async ({
    questionId,
    id,
    type,
  }: {
    questionId: string;
    id: string;
    type: 'rubric' | 'category' | 'favorite';
  }) => {
    const isCategory = type === 'category';

    const questionInfo = questionStore.getQuestionInfo({
      questionId: questionId,
      questions: this.questions,
    });
    if (!questionInfo) {
      return;
    }

    let document: RubricType | CategoryType | undefined =
      await rubricStore.fetchRubric(id);

    if (isCategory) {
      document = await categoryStore.fetchCategory(id);
    }

    if (!document) {
      return;
    }

    // set swipe start date
    if (!document.questionSwipeStartDate) {
      this.setSwipedQuestionsStartDate({id, isCategory});
    }

    // set swiped questions percentage
    await this.setSwipedQuestionsPercentage({
      id,
      currentQuestionIndex: questionInfo.currentQuestionIndex + 1,
      isCategory,
    });

    this.checkIfUserSwipedFast({id, isCategory});
  };

  checkIfUserSwipedFast = async ({
    id,
    isCategory,
  }: {
    id: string;
    isCategory: boolean;
  }) => {
    let document: RubricType | CategoryType | undefined =
      await rubricStore.fetchRubric(id);

    if (isCategory) {
      document = await categoryStore.fetchCategory(id);
    }
    if (!document) {
      return;
    }

    const newCheckTime = document.checkTime + breakPoint;

    if (
      document.swipedQuestionsPercentage >= document.checkTime &&
      newCheckTime < 100
    ) {
      const currentDate = new Date();
      const diff = minutesDiff(
        currentDate,
        new Date(document.questionSwipeStartDate),
      );

      // show modal if user swiped fast
      if (diff <= minute) {
        this.setThatWasFastModalVisible(true);
      }

      if (isCategory) {
        await categoryStore.updateCategory({
          id,
          field: 'checkTime',
          data: newCheckTime,
        });
      } else {
        await rubricStore.updateRubric({
          id,
          field: 'checkTime',
          data: newCheckTime,
        });
      }

      // set new Date for next checking
      this.setSwipedQuestionsStartDate({id, isCategory});
    }
  };

  setSwipedQuestionsStartDate = async ({
    id,
    isCategory,
  }: {
    id: string;
    isCategory: boolean;
  }) => {
    const startDate = new Date().toJSON();

    if (isCategory) {
      await categoryStore.updateCategory({
        id,
        field: 'questionSwipeStartDate',
        data: startDate,
      });
    } else {
      await rubricStore.updateRubric({
        id,
        field: 'questionSwipeStartDate',
        data: startDate,
      });
    }
  };

  setSwipedQuestionsPercentage = async ({
    id,
    currentQuestionIndex,
    isCategory,
  }: {
    id: string;
    currentQuestionIndex: number;
    isCategory: boolean;
  }) => {
    const swipedQuestionsPercentage = Math.floor(
      getPercentageFromNumber(currentQuestionIndex, this.questions.length),
    );

    if (!swipedQuestionsPercentage) {
      return;
    }

    if (isCategory) {
      await categoryStore.updateCategory({
        id,
        field: 'swipedQuestionsPercentage',
        data: swipedQuestionsPercentage,
      });
    } else {
      await rubricStore.updateRubric({
        id,
        field: 'swipedQuestionsPercentage',
        data: swipedQuestionsPercentage,
      });
    }
  };

  checkIfAllQuestionsSwiped = async ({
    questionId,
    categoryId,
    type,
  }: {
    questionId: string;
    categoryId: string;
    type: 'rubric' | 'category' | 'favorite';
  }) => {
    const isCategory = type === 'category';

    if (!isCategory) {
      return;
    }

    const questionInfo = questionStore.getQuestionInfo({
      questionId,
      questions: this.questions,
    });
    if (!questionInfo) {
      return;
    }

    const swipedQuestionsCount = questionInfo.currentQuestionIndex + 1;
    const lastQueston = this.questions.length;
    const isLastQuestion = swipedQuestionsCount === lastQueston;

    if (isLastQuestion) {
      const category = categoryStore.category;
      if (!category) {
        return;
      }

      // the modal will be opened only one time
      if (category.isAllQuestionsSwiped) {
        return;
      }

      const nextCategory = getNextCategoryName({
        currentCategory: category.name as CategoryName,
      });

      profileStore.setCurrentCategory(nextCategory);

      await categoryStore.updateCategory({
        id: categoryId,
        field: 'isAllQuestionsSwiped',
        data: true,
      });

      await userStore.updateUser({
        field: 'category',
        data: {currentCategory: nextCategory},
      });

      this.setCongratsModalVisible(true);
    }
  };
}

export default new QuestionsStore();
