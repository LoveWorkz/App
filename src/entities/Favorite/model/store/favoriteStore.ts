import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';

import {profileStore} from '@src/entities/Profile';
import {Collections} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {questionStore} from '@src/entities/QuestionCard';
import {FavoriteType} from '../types/favoriteType';

class FavoriteStore {
  favorite: FavoriteType | null = null;
  isQuestionFavorite = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsQuestionFavorite = (questionId: string) => {
    try {
      this.isQuestionFavorite =
        this.checkIsQuestionFavorite(questionId) || false;
    } catch (e) {
      console.log(e);
    }
  };

  checkIsQuestionFavorite = (questionId: string) => {
    try {
      if (!this.favorite) {
        return;
      }

      return this.favorite.questions.includes(questionId);
    } catch (e) {
      console.log(e);
    }
  };

  toggleFavorite = async () => {
    try {
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
      console.log(e);
    }
  };

  setFavorites = () => {
    try {
      runInAction(() => {
        const profile = profileStore.profileData;
        if (profile) {
          this.favorite = profile.favorites;
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  addQuestionToFavorites = async (questionId: string) => {
    const userId = userStore.authUser?.id;
    if (!userId) {
      return;
    }

    if (!this.favorite) {
      return;
    }

    const questionsIds = this.favorite.questions;
    const newQuestionsIds = [...questionsIds, questionId];

    await firestore()
      .collection(Collections.USERS)
      .doc(userId)
      .update({
        favorites: {
          currentQuestion: newQuestionsIds[0],
          questions: newQuestionsIds,
        },
      });

    await profileStore.fetchProfile();
    runInAction(() => {
      this.isQuestionFavorite = true;
    });
  };

  deleteQuestionFromFavorites = async (questionId: string) => {
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

    await firestore().collection(Collections.USERS).doc(userId).update({
      favorites,
    });

    await profileStore.fetchProfile();

    runInAction(() => {
      this.isQuestionFavorite = false;
    });
  };
}

export default new FavoriteStore();
