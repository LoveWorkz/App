import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {questionStore, QuestionType} from '@src/entities/QuestionCard';
import {rubricStore} from '@src/entities/Rubric';
import {categoryStore} from '@src/entities/Category';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {userRubricStore} from '@src/entities/UserRubric';
import {userChallengeCategoryStore} from '@src/entities/UserChallengeCategory';
import {
  FavoriteKey,
  FavoriteType,
  QuestionFavoriteType,
} from '../types/favoriteType';

class FavoriteStore {
  favorites: FavoriteType | null = null;
  isFavorite = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsFavorite = (id: string) => {
    this.isFavorite = this.checkIsFavorite(id);
  };

  setFavorites = (favorites: FavoriteType) => {
    this.favorites = favorites;
  };

  checkIsFavorite = (id: string) => {
    if (!this.favorites) {
      return false;
    }

    return this.favorites.ids.includes(id);
  };

  toggleFavorite = async (id: string, key: FavoriteKey) => {
    try {
      crashlytics().log('Switching favorites.');

      if (this.isFavorite) {
        await this.deleteFromFavorites(id, key);
      } else {
        this.addToFavorites(id, key);
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  addToFavorites = async (id: string, key: FavoriteKey) => {
    try {
      crashlytics().log('Adding to favorites.');

      const favorites = this.favorites;
      if (!favorites) {
        return;
      }

      const ids = favorites.ids;
      const newIds = [...ids, id];

      await this.updateFavorites(newIds, key);

      runInAction(() => {
        this.isFavorite = true;
        this.favorites = {...favorites, ids: newIds};
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  deleteFromFavorites = async (id: string, key: FavoriteKey) => {
    switch (key) {
      case 'question':
        await this.deleteQuestionFromFavorites(id);
        break;
      case 'challenge':
        await this.deleteChallengeFromFavorites(id);
        break;
      default:
    }
  };

  updateFavorites = async (newIds: string[], key: FavoriteKey) => {
    try {
      switch (key) {
        case 'question':
          await userRubricStore.updateUserRubricFavorites({
            field: 'ids',
            data: newIds,
          });
          break;
        case 'challenge':
          await userChallengeCategoryStore.updateUserChallengeFavorites({
            data: newIds,
          });
          break;
        default:
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  deleteChallengeFromFavorites = async (currentId: string) => {
    try {
      if (!this.favorites) {
        return;
      }

      const ids = this.favorites.ids;
      const newIds = ids.filter(id => {
        return id !== currentId;
      });

      const favorites: FavoriteType = {
        ids: newIds,
      };

      await userChallengeCategoryStore.updateUserChallengeFavorites({
        data: newIds,
      });

      runInAction(() => {
        this.isFavorite = false;
        this.favorites = favorites;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  // question favorite logic

  deleteQuestionFromFavorites = async (questionId: string) => {
    try {
      crashlytics().log('Delleting question from favorites.');

      if (!this.favorites) {
        return;
      }

      const questionsIds = this.favorites.ids;
      let favorites: QuestionFavoriteType;
      const isOnlyOneFavoriteQuestion = questionsIds.length === 1;

      const newQuestionsIds = questionsIds.filter(id => {
        return id !== questionId;
      });

      // if deleting last favorite question reset favorites
      if (isOnlyOneFavoriteQuestion) {
        favorites = {
          currentQuestion: '',
          ids: [],
        };
      } else {
        const prevQuestionId = this.getPrevFavoriteQuestionId({
          questionsIds,
          currentQuestionId: questionId,
        });

        favorites = {
          currentQuestion: prevQuestionId,
          ids: newQuestionsIds,
        };
      }

      await userRubricStore.updateUserRubricFavorites({
        data: favorites,
      });

      runInAction(() => {
        this.isFavorite = false;
        this.favorites = favorites;
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
    const isFavorite = this.checkIsFavorite(currentQuestionId);

    // when we removing chosen question from favorites we should reset swipe history
    if (!isFavorite) {
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

      const questionFavorites = this.favorites as QuestionFavoriteType;

      if (!id) {
        // initial logic

        questionId = this.getInitialQuestionId({
          questionsIds: questionFavorites.ids,
          currentQuestionId: questionFavorites.currentQuestion,
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

      const currentCategory = categoryStore.getCategory(
        currentQuestion.categoryId,
      );

      if (isInitialSetUp) {
        questionStore.setQuestionPreviewInfo({
          ...questionStore.questionPreviewInfo,
          defaultQuestionNumber: currentQuestionNumber,
        });
      }

      questionStore.setQuestionPreviewInfo({
        categoryName: currentCategory?.displayName[language] || '',
        rubricName: currentRubric?.displayName[language] || '',
        questionNumber: currentQuestionNumber,
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new FavoriteStore();
