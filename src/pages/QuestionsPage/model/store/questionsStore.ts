import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import {InterstitialAd} from 'react-native-google-mobile-ads';

import {Collections} from '@src/shared/types/firebase';
import {CategoryKey, categoryStore} from '@src/entities/Category';
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
import {QuestionsPageInfo} from '../types/questionTypes';

class QuestionsStore {
  questions: QuestionType[] = [];
  questionsPageInfo: QuestionsPageInfo = {} as QuestionsPageInfo;
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
  }) => {
    try {
      this.questionsPageloading = true;
      const categoryId = param.id;
      const currentCategory = categoryStore.category;

      // if category details is forbidden (user pressed don't show again), fetching category here
      if (!currentCategory && categoryId) {
        categoryStore.getAndSetCategory({id: categoryId});
      }

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
  }: {
    id?: string;
    key: DocumentType;
    language: LanguageValueType;
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
          rubricStore.rubricSwipeLogic({language});
          break;
        case DocumentType.CATEGORY:
          const currentCategory = categoryStore.category;
          if (!id || !currentCategory) {
            return;
          }

          const lastCategoryKey = CategoryKey.All_In_One;
          const isLastCategoryKey = currentCategory.name === lastCategoryKey;

          categoryStore.getAndSetCategory({id});

          // if it's the last category get all questions
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
          categoryStore.categorySwipeLogic({language});

          break;
        default:
          await this.fetchFavoritesQuestions();
          favoriteStore.favoritesSwipeLogic({language});
      }
    } catch (e) {
      console.log(e);
    }
  };

  swipe = async ({
    question,
    key,
    language,
    documentId,
    interstitial,
    questionNumber,
  }: {
    question: QuestionType;
    key: DocumentType;
    language: LanguageValueType;
    documentId?: string;
    interstitial: InterstitialAd;
    questionNumber: number;
  }) => {
    if (!question) {
      return;
    }

    this.loadAds({questionNumber, interstitial});

    switch (key) {
      case DocumentType.CATEGORY:
        if (documentId) {
          wowThatWasFastModalStore.wowThatWasFastLogic({
            documentId: documentId,
            type: key,
            questions: this.questions,
            questionId: question.id,
          });
        }

        const currentCategory = categoryStore.category;
        if (!currentCategory) {
          return;
        }

        let categoryId = question.categoryId;
        const lastCategoryKey = CategoryKey.All_In_One;
        const isLastCategoryKey = currentCategory.name === lastCategoryKey;

        if (isLastCategoryKey) {
          categoryId = currentCategory.id;
        }

        categoryStore.categorySwipeLogic({questionId: question.id, language});

        await userCategoryStore.updateUserCategory({
          id: categoryId,
          data: question.id,
          field: 'currentQuestion',
        });

        this.checkIfAllQuestionsSwiped({
          questionId: question.id,
          type: key,
        });

        break;
      case DocumentType.RUBRIC:
        if (documentId) {
          wowThatWasFastModalStore.wowThatWasFastLogic({
            documentId: documentId,
            type: key,
            questions: this.questions,
            questionId: question.id,
          });
        }

        rubricStore.rubricSwipeLogic({questionId: question.id, language});

        await userRubricStore.updateUserRubric({
          id: question.rubricId,
          data: question.id,
          field: 'currentQuestion',
        });

        break;
      case DocumentType.FAVORITE:
        favoriteStore.favoritesSwipeLogic({id: question.id, language});

        await userStore.updateUser({
          field: 'favorites.currentQuestion',
          data: question.id,
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
        this.questionsSize = data.size;
      });
    } catch (e) {
      console.log(e);
    }
  };

  clearQuestionsInfo = () => {
    runInAction(() => {
      this.questions = [];
      this.questionsPageInfo = {} as QuestionsPageInfo;
      this.breakPointForShowingAds = 1;
      this.questionsSize = 0;
    });
  };

  checkIfAllQuestionsSwiped = async ({
    questionId,
    type,
  }: {
    questionId: string;
    type: DocumentType;
  }) => {
    try {
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

      const swipedQuestionsCount = questionInfo.currentQuestionNumber;
      const lastQueston = this.questionsSize;
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

  loadAds = ({
    questionNumber,
    interstitial,
  }: {
    questionNumber: number;
    interstitial: InterstitialAd;
  }) => {
    const diff = getNumbersDiff(questionNumber, this.breakPointForShowingAds);

    // if user has swiped 3 or more questions load ads
    if (diff >= 3) {
      interstitial.load();
      this.breakPointForShowingAds = questionNumber;
    }
  };
}

export default new QuestionsStore();
