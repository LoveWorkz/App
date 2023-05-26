import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import {InterstitialAd} from 'react-native-google-mobile-ads';

import {Collections} from '@src/shared/types/firebase';
import {categoryStore} from '@src/entities/Category';
import {rubricStore} from '@src/entities/Rubric';
import {favoriteStore} from '@src/entities/Favorite';
import {questionStore, QuestionType} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {profileStore} from '@src/entities/Profile';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {userRubricStore} from '@src/entities/UserRubric';
import {userCategoryStore} from '@src/entities/UserCategory';
import {wowThatWasFastModalStore} from '@src/widgets/WowThatWasFastModal';
import {DocumentType} from '@src/shared/types/types';
import {getNumbersDiff} from '@src/shared/lib/common';

class QuestionsStore {
  questions: QuestionType[] = [];
  congratsModalVisible: boolean = false;
  questionsPageloading: boolean = true;

  questionsSize: number = 0;
  breakPointForShowingAds: number = 1;

  constructor() {
    makeAutoObservable(this);
  }
  setCongratsModalVisible = (isVisible: boolean) => {
    this.congratsModalVisible = isVisible;
  };

  init = async (param: {
    id?: string;
    key: DocumentType;
    language: LanguageValueType;
    questionId?: string;
  }) => {
    try {
      runInAction(() => {
        this.questionsPageloading = true;
      });

      await this.getQuestionsPageInfo(param);
    } catch (e) {
      console.log(e);
    } finally {
      runInAction(() => {
        this.questionsPageloading = false;
      });
    }
  };

  getQuestionsPageInfo = async ({
    id,
    key,
    language,
    questionId,
  }: {
    id?: string;
    key: DocumentType;
    language: LanguageValueType;
    questionId?: string;
  }) => {
    try {
      switch (key) {
        case DocumentType.RUBRIC:
          if (!id) {
            return;
          }
          rubricStore.getAndSetRubric(id);
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
          rubricStore.getQuestionSwipeInfoForRubric({
            language,
            questions: this.questions,
          });
          break;
        case DocumentType.CATEGORY:
          if (!id) {
            return;
          }

          categoryStore.getAndSetCategory({id});

          const isLastCategoryKey = categoryStore.getIsLastCategory();
          // if it's the last category (All In One) get all questions
          if (isLastCategoryKey) {
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
          categoryStore.getQuestionSwipeInfoForCategory({
            initialQuestionId: questionId,
            questions: this.questions,
            language,
          });

          break;
        default:
          await this.fetchFavoritesQuestions();
          favoriteStore.getQuestionSwipeInfoForFavorites({
            language,
            questions: this.questions,
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  swipe = async (swipeData: {
    question: QuestionType;
    key: DocumentType;
    language: LanguageValueType;
    documentId?: string;
    interstitial: InterstitialAd;
    questionNumber: number;
  }) => {
    const {question, questionNumber, interstitial, key, documentId} = swipeData;

    if (!question) {
      return;
    }

    this.loadAds({questionNumber, interstitial});

    if (key !== DocumentType.FAVORITE && documentId) {
      wowThatWasFastModalStore.wowThatWasFastLogic({
        documentId,
        type: key,
        questions: this.questions,
        questionId: question.id,
      });
    }

    switch (key) {
      case DocumentType.CATEGORY:
        this.categorySwipeLogic(swipeData);
        break;
      case DocumentType.RUBRIC:
        this.rubricSwipeLogic(swipeData);
        break;
      case DocumentType.FAVORITE:
        this.favoritesSwipeLogic(swipeData);
        break;
      default:
    }
  };

  categorySwipeLogic = async (categorySwipeParam: {
    question: QuestionType;
    key: DocumentType;
    language: LanguageValueType;
  }) => {
    const {question, key, language} = categorySwipeParam;

    try {
      categoryStore.getQuestionSwipeInfoForCategory({
        questionId: question.id,
        questions: this.questions,
        language,
      });

      let categoryId = question.categoryId;
      const currentCategory = categoryStore.category;
      if (!currentCategory) {
        return;
      }

      const isLastCategoryKey = categoryStore.getIsLastCategory();

      // if category is last (All In One) set previous category id
      if (isLastCategoryKey) {
        categoryId = currentCategory.id;
      }

      await userCategoryStore.updateUserCategory({
        id: categoryId,
        data: question.id,
        field: 'currentQuestion',
      });

      this.checkIfAllQuestionsSwiped({
        questionId: question.id,
        type: key,
      });
    } catch (e) {
      console.log(e);
    }
  };

  rubricSwipeLogic = async (rubricSwipeParam: {
    question: QuestionType;
    key: DocumentType;
    language: LanguageValueType;
  }) => {
    try {
      const {question, language} = rubricSwipeParam;

      rubricStore.getQuestionSwipeInfoForRubric({
        questionId: question.id,
        questions: this.questions,
        language,
      });

      await userRubricStore.updateUserRubric({
        id: question.rubricId,
        data: question.id,
        field: 'currentQuestion',
      });
    } catch (e) {
      console.log(e);
    }
  };

  favoritesSwipeLogic = async (favoritesSwipeParam: {
    question: QuestionType;
    language: LanguageValueType;
  }) => {
    try {
      const {question, language} = favoritesSwipeParam;

      favoriteStore.getQuestionSwipeInfoForFavorites({
        id: question.id,
        questions: this.questions,
        language,
      });

      await userStore.updateUser({
        field: 'favorites.currentQuestion',
        data: question.id,
      });
    } catch (e) {
      console.log(e);
    }
  };

  fetchQuestionsById = async ({id, key}: {id: string; key: string}) => {
    try {
      const source = await userStore.checkIsUserOfflineAndReturnSource();
      const data = await firestore()
        .collection(Collections.QUESTIONS)
        .orderBy('createdDate', 'desc')
        .where(key, '==', id)
        .get({source});

      const questions = data.docs.map(question => ({
        ...question.data(),
        id: question.id,
      }));

      runInAction(() => {
        this.questions = questions as QuestionType[];
        this.questionsSize = data.size;
      });
    } catch (e) {
      console.log(e);
    }
  };

  fetchAllQuestions = async () => {
    try {
      const source = await userStore.checkIsUserOfflineAndReturnSource();
      const data = await firestore()
        .collection(Collections.QUESTIONS)
        .get({source});

      const questions = data.docs.map(question => ({
        ...question.data(),
        id: question.id,
      }));

      runInAction(() => {
        this.questions = questions as QuestionType[];
        this.questionsSize = data.size;
      });
    } catch (e) {
      console.log(e);
    }
  };

  fetchFavoritesQuestions = async () => {
    try {
      const source = await userStore.checkIsUserOfflineAndReturnSource();
      const favorites = favoriteStore.favorite;
      if (!favorites) {
        return;
      }

      const data = await firestore()
        .collection(Collections.QUESTIONS)
        .get({source});

      const questions = data.docs.map(question => ({
        ...question.data(),
        id: question.id,
      }));

      const favoritesQuestions = questions.filter(question => {
        return favorites.questions.includes(question.id);
      });

      runInAction(() => {
        this.questions = favoritesQuestions as QuestionType[];
        this.questionsSize = favoritesQuestions.length;
      });
    } catch (e) {
      console.log(e);
    }
  };

  checkIfAllQuestionsSwiped = async (param: {
    questionId: string;
    type: DocumentType;
  }) => {
    try {
      const {questionId, type} = param;

      const isCategory = type === DocumentType.CATEGORY;

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

      // check if user reached the last question of category
      const currentQuestionNumber = questionInfo.currentQuestionNumber;
      const lastQueston = this.questionsSize;
      const isLastQuestion = currentQuestionNumber === lastQueston;

      if (isLastQuestion) {
        const category = categoryStore.category;
        if (!category) {
          return;
        }

        // the modal will be opened only one time
        if (category.isAllQuestionsSwiped) {
          return;
        }

        this.UpdateUserDataAfterSwipedAllQuestions({
          categoryId: category.id,
        });

        this.setCongratsModalVisible(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  UpdateUserDataAfterSwipedAllQuestions = async ({
    categoryId,
  }: {
    categoryId: string;
  }) => {
    const nextCategory = categoriesStore.getNextCategory({
      currentCategoryId: categoryId,
    });

    if (!nextCategory) {
      return;
    }

    profileStore.setCurrentCategory({
      currentCategory: nextCategory.name,
    });

    await userCategoryStore.updateUserCategory({
      id: categoryId,
      field: 'isAllQuestionsSwiped',
      data: true,
    });

    await userCategoryStore.updateUserCategory({
      id: nextCategory.id,
      field: 'isBlocked',
      data: false,
    });

    await userStore.updateUser({
      field: 'category.currentCategory',
      data: nextCategory.name,
    });
  };

  loadAds = (param: {questionNumber: number; interstitial: InterstitialAd}) => {
    const {questionNumber, interstitial} = param;

    const diff = getNumbersDiff(questionNumber, this.breakPointForShowingAds);

    // if user has swiped 3 or more questions load ads
    if (diff >= 3) {
      interstitial.load();
      this.breakPointForShowingAds = questionNumber;
    }
  };

  clearQuestionsInfo = () => {
    runInAction(() => {
      this.questions = [];
      this.breakPointForShowingAds = 1;
      this.questionsSize = 0;
    });
  };
}

export default new QuestionsStore();
