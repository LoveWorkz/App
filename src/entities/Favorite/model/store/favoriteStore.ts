import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';

import {questionStore, QuestionType} from '@src/entities/QuestionCard';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {userRubricStore} from '@src/entities/UserRubric';
import {userChallengeCategoryStore} from '@src/entities/UserChallengeCategory';
import {userCategoryStore} from '@src/entities/UserCategory';
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
    this.isFavorite = this.checkIsFavorite(id, this.favorites);
  };

  setFavorites = (favorites: FavoriteType) => {
    this.favorites = favorites;
  };

  checkIsFavorite = (id: string, favorites: FavoriteType | null) => {
    if (!favorites) {
      return false;
    }

    return favorites.ids.includes(id);
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
        this.setFavorites({...favorites, ids: newIds});
      });
    } catch (e) {
      errorHandler({error: e});
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
        case 'session':
          await userCategoryStore.updateUserLevelFavorites({
            data: newIds,
          });

          break;
        default:
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  deleteFromFavorites = async (id: string, key: FavoriteKey) => {
    switch (key) {
      case 'question':
        const newQuestionFavoriteData =
          await userRubricStore.deleteQuestionFromFavorites({
            questionId: id,
            favoriteIds: this.favorites?.ids || [],
          });

        if (newQuestionFavoriteData) {
          runInAction(() => {
            this.isFavorite = newQuestionFavoriteData.isFavorite;
            this.setFavorites(newQuestionFavoriteData.favorites);
          });
        }
        break;
      case 'challenge':
        const newChallengeFavoriteData =
          await userChallengeCategoryStore.deleteChallengeFromFavorites({
            challengeId: id,
            favoriteIds: this.favorites?.ids || [],
          });

        if (newChallengeFavoriteData) {
          runInAction(() => {
            this.isFavorite = newChallengeFavoriteData.isFavorite;
            this.setFavorites(newChallengeFavoriteData.favorites);
          });
        }
      case 'session':
        const newSessionFavoriteData =
          await userCategoryStore.deleteSessionFromFavorites({
            sessionId: id,
            favoriteIds: this.favorites?.ids || [],
          });

        if (newSessionFavoriteData) {
          runInAction(() => {
            this.isFavorite = newSessionFavoriteData.isFavorite;
            this.setFavorites(newSessionFavoriteData.favorites);
          });
        }
        break;
      default:
    }
  };

  // question favorite logic

  getInitialQuestionId = ({
    currentQuestionId,
    questionsIds,
  }: {
    currentQuestionId: string;
    questionsIds: string[];
  }) => {
    const isFavorite = this.checkIsFavorite(currentQuestionId, this.favorites);

    // when we removing chosen question from favorites we should reset swipe history
    if (!isFavorite) {
      return questionsIds[0];
    }

    return currentQuestionId;
  };

  getQuestionSwipeInfoForFavorites = async ({
    id,
    questions,
  }: {
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

      if (isInitialSetUp) {
        questionStore.setDefaultQuestionNumber(currentQuestionNumber);
      }

      questionStore.setQuestion(currentQuestion);
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new FavoriteStore();
