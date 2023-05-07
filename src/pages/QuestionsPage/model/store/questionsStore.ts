import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {Collections} from '@src/shared/types/firebase';
import {categoryStore, CategoryType} from '@src/entities/Category';
import {rubricStore, RubricType} from '@src/entities/Rubric';
import {favoriteStore} from '@src/entities/Favorite';
import {questionStore, QuestionType} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {minutesDiff} from '@src/shared/lib/date';
import {profileStore} from '@src/entities/Profile';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {getPercentageFromNumber} from '@src/shared/lib/common';
import {QuestionsPageInfo} from '../types/questionTypes';
import {breakPoint, minute} from '../lib/questions';

class QuestionsStore {
  questions: QuestionType[] = [];
  questionsPageInfo: QuestionsPageInfo = {} as QuestionsPageInfo;
  thatWasFastModalVisible: boolean = false;
  congratsModalVisible: boolean = false;
  questionsPageloading: boolean = true;
  isWowThatWasFastModalForbidden: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setThatWasFastModalVisible = (isVisible: boolean) => {
    this.thatWasFastModalVisible = isVisible;
  };

  setIsWowThatWasFastModalForbidden = (isVisible: boolean) => {
    this.isWowThatWasFastModalForbidden = isVisible;
  };

  setCongratsModalVisible = (isVisible: boolean) => {
    this.congratsModalVisible = isVisible;
  };

  getQuestionsPageInfo = async ({
    id,
    key,
    language,
  }: {
    id?: string;
    key: 'rubric' | 'category' | 'favorite';
    language: LanguageValueType;
  }) => {
    try {
      runInAction(() => {
        this.questionsPageloading = true;
      });
      switch (key) {
        case 'rubric':
          if (!id) {
            return;
          }
          await rubricStore.fetchRubric(id);
          await this.fetchQuestionsById({
            id,
            key: 'rubricId',
          });
          // init current question id for the first time
          await rubricStore.initUserRubricQuestionId({
            id,
            questions: this.questions,
          });
          // init questions page info
          rubricStore.rubricSwipeLogic({language});
          break;
        case 'category':
          const currentCategory = categoryStore.category;
          if (!id || !currentCategory) {
            return;
          }
          const currentCategoryName = currentCategory.name === 'All_In_One';

          await categoryStore.fetchCategory({id});

          // if it's the last category get all questions
          if (currentCategoryName) {
            await this.fetchAllQuestions();
          } else {
            await this.fetchQuestionsById({
              id,
              key: 'categoryId',
            });
          }

          // init current question id for the first time
          await categoryStore.initUserCategoryQuestionId({
            id,
            questions: this.questions,
          });
          // init questions page info
          categoryStore.categorySwipeLogic({language});

          break;
        default:
          await this.fetchFavoritesQuestions();
          favoriteStore.favoritesSwipeLogic({language});
      }
    } catch (e) {
      console.log(e);
    } finally {
      runInAction(() => {
        this.questionsPageloading = false;
      });
    }
  };

  swipe = async ({
    question,
    key,
    language,
  }: {
    question: QuestionType;
    key: 'rubric' | 'category' | 'favorite';
    language: LanguageValueType;
  }) => {
    const userId = userStore.authUserId;
    if (!question && !userId) {
      return;
    }

    switch (key) {
      case 'category':
        const currentCategory = categoryStore.category;
        let categoryId = question.categoryId;

        if (currentCategory && currentCategory.name === 'All_In_One') {
          categoryId = currentCategory.id;
        }
        categoryStore.categorySwipeLogic({questionId: question.id, language});
        await firestore()
          .collection(Collections.USER_CATEGORIES)
          .doc(userId)
          .update({
            [`categories.${categoryId}.currentQuestion`]: question.id,
          });
        break;
      case 'rubric':
        rubricStore.rubricSwipeLogic({questionId: question.id, language});
        await firestore()
          .collection(Collections.USER_RUBRICS)
          .doc(userId)
          .update({
            [`rubrics.${question.rubricId}.currentQuestion`]: question.id,
          });
        break;
      case 'favorite':
        favoriteStore.favoritesSwipeLogic({id: question.id, language});
        await firestore()
          .collection(Collections.USERS)
          .doc(userId)
          .update({
            favorites: {
              ...favoriteStore.favorite,
              currentQuestion: question.id,
            },
          });
        break;
      default:
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

  fetchAllQuestions = async () => {
    try {
      const data = await firestore().collection(Collections.QUESTIONS).get();
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
      document = await categoryStore.fetchCategory({id});
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
      document = await categoryStore.fetchCategory({id});
    }
    if (!document) {
      return;
    }

    const newCheckTime = document.breakPointForCheckingDate + breakPoint;

    if (
      document.swipedQuestionsPercentage >=
        document.breakPointForCheckingDate &&
      newCheckTime < 100
    ) {
      const currentDate = new Date();
      const diff = minutesDiff(
        currentDate,
        new Date(document.questionSwipeStartDate),
      );

      // show modal if user swiped fast
      if (diff <= minute && !this.isWowThatWasFastModalForbidden) {
        this.setThatWasFastModalVisible(true);
      }

      if (isCategory) {
        await categoryStore.updateUserCategory({
          id,
          field: 'breakPointForCheckingDate',
          data: newCheckTime,
        });
      } else {
        await rubricStore.updateUserRubric({
          id,
          field: 'breakPointForCheckingDate',
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
      await categoryStore.updateUserCategory({
        id,
        field: 'questionSwipeStartDate',
        data: startDate,
      });
    } else {
      await rubricStore.updateUserRubric({
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
    try {
      const swipedQuestionsPercentage = Math.floor(
        getPercentageFromNumber(currentQuestionIndex, this.questions.length),
      );

      if (!swipedQuestionsPercentage) {
        return;
      }

      if (isCategory) {
        await categoryStore.updateUserCategory({
          id,
          field: 'swipedQuestionsPercentage',
          data: swipedQuestionsPercentage,
        });
      } else {
        await rubricStore.updateUserRubric({
          id,
          field: 'swipedQuestionsPercentage',
          data: swipedQuestionsPercentage,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  checkIfAllQuestionsSwiped = async ({
    questionId,
    type,
  }: {
    questionId: string;
    type: 'rubric' | 'category' | 'favorite';
  }) => {
    try {
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

        const nextCategory = categoriesStore.getNextCategory({
          currentCategoryId: category.id,
        });

        if (!nextCategory) {
          return;
        }

        profileStore.setCurrentCategory({
          currentCategory: nextCategory.name,
          currentCategoryId: nextCategory.id,
        });

        // after swiped all questions update user data

        await categoryStore.updateUserCategory({
          id: category.id,
          field: 'isAllQuestionsSwiped',
          data: true,
        });

        await categoryStore.updateUserCategory({
          id: nextCategory.id,
          field: 'isBlocked',
          data: false,
        });

        await userStore.updateUser({
          field: 'category',
          data: {currentCategory: nextCategory.name},
        });

        this.setCongratsModalVisible(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  forbidThatWasFastModalVisible = async () => {
    try {
      await userStore.updateUser({
        field: 'isWowThatWasFastModalForbidden',
        data: true,
      });
      this.setIsWowThatWasFastModalForbidden(true);
      this.setThatWasFastModalVisible(false);
    } catch (e) {
      console.log(e);
    }
  };
}

export default new QuestionsStore();
