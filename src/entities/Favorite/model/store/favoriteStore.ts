import {makeAutoObservable, runInAction} from 'mobx';

import {profileStore} from '@src/entities/Profile';
import {userStore} from '@src/entities/User';
import {questionStore} from '@src/entities/QuestionCard';
import {questionsStore} from '@src/pages/QuestionsPage';
import {rubricStore} from '@src/entities/Rubric';
import {categoryStore} from '@src/entities/Category';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {FavoriteType} from '../types/favoriteType';

class FavoriteStore {
  favorite: FavoriteType | null = null;
  isQuestionFavorite = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsQuestionFavorite = (questionId: string) => {
    try {
      this.isQuestionFavorite = this.checkIsQuestionFavorite(questionId);
    } catch (e) {
      console.log(e);
    }
  };

  checkIsQuestionFavorite = (questionId: string) => {
    if (!this.favorite) {
      return false;
    }

    return this.favorite.questions.includes(questionId);
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

  setFavorites = (favorites: FavoriteType) => {
    try {
      runInAction(() => {
        this.favorite = favorites;
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

    await userStore.updateUser({
      field: 'favorites',
      data: favorites,
    });

    await profileStore.fetchProfile();

    runInAction(() => {
      this.isQuestionFavorite = false;
    });
  };

  favoritesSwipeLogic = async ({
    id,
    language,
  }: {
    language: LanguageValueType;
    id?: string;
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
        questions: questionsStore.questions,
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

      questionsStore.setQuestionsPageInfo({
        questionsCount: questionsStore.questions.length,
        categoryName: currentCategory.displayName[language],
        rubricName: currentRubric.displayName[language],
        swipedQuestionsCount: currentQuestionNumber,
        currentQuestion,
      });
    } catch (e) {
      console.log(e);
    }
  };
}

export default new FavoriteStore();
