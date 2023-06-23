import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {userStore} from '@src/entities/User';
import {questionStore, QuestionType} from '@src/entities/QuestionCard';
import {rubricStore} from '@src/entities/Rubric';
import {categoryStore} from '@src/entities/Category';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {FavoriteType} from '../types/favoriteType';

class FavoriteStore {
  favorites: FavoriteType | null = null;
  isQuestionFavorite = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsQuestionFavorite = (questionId: string) => {
    this.isQuestionFavorite = this.checkIsQuestionFavorite(questionId);
  };

  checkIsQuestionFavorite = (questionId: string) => {
    if (!this.favorites) {
      return false;
    }

    return this.favorites.questions.includes(questionId);
  };

  toggleFavorite = async () => {
    try {
      crashlytics().log('Switching favorites questions.');

      const currentQuestion = questionStore.question;
      if (!currentQuestion) {
        return;
      }

      if (this.isQuestionFavorite) {
        await this.deleteQuestionFromFavorites(currentQuestion.id);
      } else {
        this.addQuestionToFavorites(currentQuestion.id);
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setFavorites = (favorites: FavoriteType) => {
    this.favorites = favorites;
  };

  addQuestionToFavorites = async (questionId: string) => {
    try {
      crashlytics().log('Adding question to favorites.');

      if (!this.favorites) {
        return;
      }

      const questionsIds = this.favorites.questions;
      const newQuestionsIds = [...questionsIds, questionId];

      await userStore.updateUser({
        field: 'favorites.questions',
        data: newQuestionsIds,
      });

      await userStore.fetchUser();

      runInAction(() => {
        this.isQuestionFavorite = true;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  deleteQuestionFromFavorites = async (questionId: string) => {
    try {
      crashlytics().log('Delleting question from favorites.');

      const userId = userStore.userId;
      if (!userId) {
        return;
      }
      if (!this.favorites) {
        return;
      }

      const questionsIds = this.favorites.questions;
      let favorites: FavoriteType;
      const isOnlyOneFavoriteQuestion = questionsIds.length === 1;

      const newQuestionsIds = questionsIds.filter(id => {
        return id !== questionId;
      });

      // if deleting last favorite question reset favorites
      if (isOnlyOneFavoriteQuestion) {
        favorites = {
          currentQuestion: '',
          questions: [],
        };
      } else {
        const prevQuestionId = this.getPrevFavoriteQuestionId({
          questionsIds,
          currentQuestionId: questionId,
        });

        favorites = {
          currentQuestion: prevQuestionId,
          questions: newQuestionsIds,
        };
      }

      await userStore.updateUser({
        field: 'favorites',
        data: favorites,
      });

      await userStore.fetchUser();

      runInAction(() => {
        this.isQuestionFavorite = false;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getPrevFavoriteQuestionId = ({
    currentQuestionId,
    questionsIds,
  }: {
    currentQuestionId: string;
    questionsIds: string[];
  }) => {
    const currentFavoriteQuestionIndex = questionsIds.findIndex(
      id => currentQuestionId === id,
    );

    const isQuestionIdFound = currentFavoriteQuestionIndex === -1;
    const isFirstQuestionId = currentQuestionId === questionsIds[0];

    if (isQuestionIdFound || isFirstQuestionId) {
      return questionsIds[0];
    }

    return questionsIds[currentFavoriteQuestionIndex - 1];
  };

  getInitialQuestionId = ({
    currentQuestionId,
    questionsIds,
  }: {
    currentQuestionId: string;
    questionsIds: string[];
  }) => {
    const isQuestionFavorite = this.checkIsQuestionFavorite(currentQuestionId);

    // when we removing chosen question from favorites we should reset swipe history
    if (!isQuestionFavorite) {
      return questionsIds[0];
    }

    return currentQuestionId;
  };

  getQuestionSwipeInfoForFavorites = async ({
    id,
    language,
    questions,
  }: {
    language: LanguageValueType;
    id?: string;
    questions: QuestionType[];
  }) => {
    try {
      let questionId = id;
      const isInitialSetUp = !questionId;

      if (!this.favorites) {
        return;
      }

      if (!id) {
        // initial logic

        questionId = this.getInitialQuestionId({
          questionsIds: this.favorites.questions,
          currentQuestionId: this.favorites.currentQuestion,
        });
      }

      if (!questionId) {
        return;
      }

      const questionInfo = questionStore.getQuestionInfo({
        questionId: questionId,
        questions: questions,
      });
      if (!questionInfo) {
        return;
      }
      const {currentQuestion, currentQuestionNumber} = questionInfo;

      questionStore.setQuestion(currentQuestion);

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

      if (isInitialSetUp) {
        questionStore.setQuestionPreviewInfo({
          ...questionStore.questionPreviewInfo,
          defaultQuestionNumber: currentQuestionNumber,
        });
      }

      questionStore.setQuestionPreviewInfo({
        categoryName: currentCategory.displayName[language],
        rubricName: currentRubric.displayName[language],
        questionNumber: currentQuestionNumber,
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new FavoriteStore();
