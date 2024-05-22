import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {rubricStore, RubricType} from '@src/entities/Rubric';
import {
  favoriteStore,
  FavoriteType,
  questionFavorites,
  QuestionFavoriteType,
} from '@src/entities/Favorite';
import {userRubricInitData} from '../lib/userRubric';
import {UserRubric} from '../types/userRubricType';

class UserRubricStore {
  userRubric: null | UserRubric = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchUserRubrics = async () => {
    try {
      crashlytics().log('Fetching User Rubrics.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();
      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      const data = await firestore()
        .collection(Collections.USER_RUBRICS)
        .doc(userId)
        .get({source});

      const userRubrics = data.data() as UserRubric;

      runInAction(() => {
        this.userRubric = userRubrics;
        favoriteStore.setFavorites({
          favorites: userRubrics.favorites,
          favoriteKey: 'question',
        });
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setUserRubric = async (userId: string) => {
    try {
      crashlytics().log('Setting User Rubrics.');

      const defaultRubrics = await rubricStore.fetchDefaultRubrics();
      if (!defaultRubrics) {
        return;
      }

      const userRubrics: Record<string, Partial<RubricType>> = {};

      defaultRubrics.forEach(rubric => {
        userRubrics[rubric.id] = {
          ...userRubricInitData,
        };
      });

      const userRubric = {
        rubrics: userRubrics,
        favorites: questionFavorites,
      };

      await firestore()
        .collection(Collections.USER_RUBRICS)
        .doc(userId)
        .set(userRubric);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateUserRubric = async ({
    id,
    field,
    data,
  }: {
    id: string;
    field: string;
    data: number | string;
  }) => {
    try {
      crashlytics().log('Updating User Rubric.');

      const isOffline = await userStore.getIsUserOffline();
      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      if (isOffline) {
        firestore()
          .collection(Collections.USER_RUBRICS)
          .doc(userId)
          .update({
            [`rubrics.${id}.${field}`]: data,
          });
      } else {
        await firestore()
          .collection(Collections.USER_RUBRICS)
          .doc(userId)
          .update({
            [`rubrics.${id}.${field}`]: data,
          });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateUserRubricFavorites = async ({
    field,
    data,
  }: {
    field?: string;
    data: string | string[] | FavoriteType;
  }) => {
    try {
      crashlytics().log('Updating User Rubric Favorites.');

      const isOffline = await userStore.getIsUserOffline();
      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      if (isOffline) {
        firestore()
          .collection(Collections.USER_RUBRICS)
          .doc(userId)
          .update({
            [`favorites${field ? `.${field}` : ''}`]: data,
          });
      } else {
        await firestore()
          .collection(Collections.USER_RUBRICS)
          .doc(userId)
          .update({
            [`favorites${field ? `.${field}` : ''}`]: data,
          });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  deleteQuestionFromFavorites = async ({
    questionId,
    favoriteIds,
  }: {
    questionId: string;
    favoriteIds: string[];
  }) => {
    try {
      crashlytics().log('Delleting question from favorites.');

      const questionsIds = favoriteIds;
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

      await this.updateUserRubricFavorites({
        data: favorites,
      });

      return {
        isFavorite: false,
        favorites: favorites,
      };
    } catch (e) {
      errorHandler({error: e});
      return null;
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

  deleteUserRubric = async (userId: string) => {
    try {
      crashlytics().log('Deleting User Rubric.');

      await firestore()
        .collection(Collections.USER_RUBRICS)
        .doc(userId)
        .delete();
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new UserRubricStore();
