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
  coreChallengeFavorites: FavoriteType | null = null;
  specialChallengeFavorites: FavoriteType | null = null;
  questionFavorites: FavoriteType | null = null;
  sessiionFavorites: FavoriteType | null = null;

  isFavorite = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsFavorite = (param: {id: string; favoriteKey: FavoriteKey}) => {
    this.isFavorite = this.checkIsFavorite(param);
  };

  setFavorites = ({
    favoriteKey,
    favorites,
  }: {
    favorites: FavoriteType;
    favoriteKey: FavoriteKey;
  }) => {
    switch (favoriteKey) {
      case 'coreChallenge':
        this.coreChallengeFavorites = favorites;
        break;
      case 'specialChallenge':
        this.specialChallengeFavorites = favorites;
        break;
      case 'question':
        this.questionFavorites = favorites;
        break;
      case 'session':
        this.sessiionFavorites = favorites;
        break;
    }
  };

  checkIsFavorite = ({
    id,
    favoriteKey,
  }: {
    id: string;
    favoriteKey: FavoriteKey;
  }) => {
    switch (favoriteKey) {
      case 'coreChallenge':
        if (this.coreChallengeFavorites) {
          return this.coreChallengeFavorites.ids.includes(id);
        }
        return false;
      case 'specialChallenge':
        if (this.specialChallengeFavorites) {
          return this.specialChallengeFavorites.ids.includes(id);
        }
        return false;
      case 'question':
        if (this.questionFavorites) {
          return this.questionFavorites.ids.includes(id);
        }
        return false;
      case 'session':
        if (this.sessiionFavorites) {
          return this.sessiionFavorites.ids.includes(id);
        }
        return false;
      default:
        return false;
    }
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

      let favorites: FavoriteType | null;

      switch (key) {
        case 'coreChallenge':
          favorites = this.coreChallengeFavorites;
          break;
        case 'specialChallenge':
          favorites = this.specialChallengeFavorites;
          break;
        case 'question':
          favorites = this.questionFavorites;
          break;
        case 'session':
          favorites = this.sessiionFavorites;
          break;
        default:
          favorites = null;
      }

      if (!favorites) {
        return;
      }

      const ids = favorites.ids;
      const newIds = [...ids, id];

      await this.updateFavorites(newIds, key);

      runInAction(() => {
        this.isFavorite = true;
        this.setFavorites({
          favorites: {...favorites, ids: newIds},
          favoriteKey: key,
        });
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
        case 'coreChallenge':
          await userChallengeCategoryStore.updateUserChallengeFavorites({
            data: newIds,
            isCore: true,
          });

          break;
        case 'specialChallenge':
          await userChallengeCategoryStore.updateUserChallengeFavorites({
            data: newIds,
            isCore: false,
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
            favoriteIds: this.questionFavorites?.ids || [],
          });

        if (newQuestionFavoriteData) {
          runInAction(() => {
            this.isFavorite = newQuestionFavoriteData.isFavorite;
            this.setFavorites({
              favorites: newQuestionFavoriteData.favorites,
              favoriteKey: 'question',
            });
          });
        }
        break;
      case 'coreChallenge':
        const newCoreChallengeFavoriteData =
          await userChallengeCategoryStore.deleteChallengeFromFavorites({
            challengeId: id,
            favoriteIds: this.coreChallengeFavorites?.ids || [],
            isCore: true,
          });

        if (newCoreChallengeFavoriteData) {
          runInAction(() => {
            this.isFavorite = newCoreChallengeFavoriteData.isFavorite;
            this.setFavorites({
              favorites: newCoreChallengeFavoriteData.favorites,
              favoriteKey: 'coreChallenge',
            });
          });
        }
        break;
      case 'specialChallenge':
        const newSpecialChallengeFavoriteData =
          await userChallengeCategoryStore.deleteChallengeFromFavorites({
            challengeId: id,
            favoriteIds: this.specialChallengeFavorites?.ids || [],
            isCore: false,
          });

        if (newSpecialChallengeFavoriteData) {
          runInAction(() => {
            this.isFavorite = newSpecialChallengeFavoriteData.isFavorite;
            this.setFavorites({
              favorites: newSpecialChallengeFavoriteData.favorites,
              favoriteKey: 'specialChallenge',
            });
          });
        }
        break;
      case 'session':
        const newSessionFavoriteData =
          await userCategoryStore.deleteSessionFromFavorites({
            sessionId: id,
            favoriteIds: this.sessiionFavorites?.ids || [],
          });

        if (newSessionFavoriteData) {
          runInAction(() => {
            this.isFavorite = newSessionFavoriteData.isFavorite;
            this.setFavorites({
              favorites: newSessionFavoriteData.favorites,
              favoriteKey: 'session',
            });
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
    const isFavorite = this.checkIsFavorite({
      id: currentQuestionId,
      favoriteKey: 'question',
    });

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

      if (!this.questionFavorites) {
        return;
      }

      const questionFavorites = this.questionFavorites as QuestionFavoriteType;

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
