import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {profileStore} from '@src/entities/Profile';
import {userStore} from '@src/entities/User';
import {questionStore, QuestionType} from '@src/entities/QuestionCard';
import {rubricStore} from '@src/entities/Rubric';
import {categoryStore} from '@src/entities/Category';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {FavoriteType} from '../types/favoriteType';

class FavoriteStore {
  favorite: FavoriteType | null = null;
  isQuestionFavorite = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsQuestionFavorite = (questionId: string) => {
    this.isQuestionFavorite = this.checkIsQuestionFavorite(questionId);
  };

  checkIsQuestionFavorite = (questionId: string) => {
    if (!this.favorite) {
      return false;
    }

    return this.favorite.questions.includes(questionId);
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
    this.favorite = favorites;
  };

  addQuestionToFavorites = async (questionId: string) => {
    try {
      crashlytics().log('Adding question to favorites.');

      const userId = userStore.authUser?.id;
      if (!userId) {
        return;
      }

      if (!this.favorite) {
        return;
      }

      const questionsIds = this.favorite.questions;
      const newQuestionsIds = [...questionsIds, questionId];

      await userStore.updateUser({
        field: 'favorites',
        data: {
          currentQuestion: newQuestionsIds[0],
          questions: newQuestionsIds,
        },
      });

      await profileStore.fetchProfile();

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

      const userId = userStore.authUser?.id;
      if (!userId) {
        return;
      }
      if (!this.favorite) {
        return;
      }

      const questionsIds = this.favorite.questions;
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
        favorites = {
          currentQuestion: newQuestionsIds[0],
          questions: newQuestionsIds,
        };
      }

      await userStore.updateUser({
        field: 'favorites',
        data: favorites,
      });

      await profileStore.fetchProfile();

      runInAction(() => {
        this.isQuestionFavorite = false;
      });
    } catch (e) {
      errorHandler({error: e});
    }
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

      // initial logic
      if (!id && this.favorite) {
        const lastSwipedQuestionId = this.favorite.currentQuestion;
        const isQuestionInFavorite =
          this.favorite.questions.includes(lastSwipedQuestionId);

        // when we removing chosen question from favorites we should reset swipe history
        questionId = isQuestionInFavorite
          ? this.favorite.currentQuestion
          : this.favorite.questions[0];
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
