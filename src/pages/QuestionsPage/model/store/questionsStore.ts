import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import {InterstitialAd} from 'react-native-google-mobile-ads';
import crashlytics from '@react-native-firebase/crashlytics';

import {Collections} from '@src/shared/types/firebase';
import {categoryStore} from '@src/entities/Category';
import {rubricStore} from '@src/entities/Rubric';
import {favoriteStore} from '@src/entities/Favorite';
import {questionStore, QuestionType} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {userRubricStore} from '@src/entities/UserRubric';
import {userCategoryStore} from '@src/entities/UserCategory';
import {wowThatWasFastModalStore} from '@src/widgets/WowThatWasFastModal';
import {DocumentType} from '@src/shared/types/types';
import {getNumbersDiff} from '@src/shared/lib/common';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {sessionStore} from '@src/entities/Session';

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

  clearQuestionsInfo = () => {
    runInAction(() => {
      this.questions = [];
      this.breakPointForShowingAds = 1;
      this.questionsSize = 0;
    });
  };

  init = async (param: {
    id?: string;
    key: DocumentType;
    language: LanguageValueType;
    questionId?: string;
  }) => {
    try {
      crashlytics().log('Fetching questions page');

      runInAction(() => {
        this.questionsPageloading = true;
      });

      await this.getQuestionsPageInfo(param);
    } catch (e) {
      errorHandler({error: e});
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
          await this.fetchSpecificQuestions({
            id,
            key: DocumentType.RUBRIC,
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
            await this.fetchSpecificQuestions({
              id,
              key: DocumentType.CATEGORY,
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
      errorHandler({error: e});
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
    try {
      crashlytics().log('Swiping question.');

      const {question, questionNumber, interstitial, key, documentId} =
        swipeData;

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
    } catch (e) {
      errorHandler({error: e});
    }
  };

  categorySwipeLogic = async (categorySwipeParam: {
    question: QuestionType;
    key: DocumentType;
    language: LanguageValueType;
  }) => {
    try {
      crashlytics().log('Swiping category questions.');

      const {question, language} = categorySwipeParam;

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
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  rubricSwipeLogic = async (rubricSwipeParam: {
    question: QuestionType;
    key: DocumentType;
    language: LanguageValueType;
  }) => {
    try {
      crashlytics().log('Swiping rubric questions.');

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
      errorHandler({error: e});
    }
  };

  favoritesSwipeLogic = async (favoritesSwipeParam: {
    question: QuestionType;
    language: LanguageValueType;
  }) => {
    try {
      crashlytics().log('Swiping favorites questions.');

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
      errorHandler({error: e});
    }
  };

  fetchSpecificQuestions = async ({
    id,
    key,
  }: {
    id: string;
    key: DocumentType;
  }) => {
    try {
      crashlytics().log(`Fetching ${key} questions`);

      const source = await userStore.checkIsUserOfflineAndReturnSource();
      const data = await firestore()
        .collection(Collections.QUESTIONS)
        .get({source});

      const questionsMap: Record<string, QuestionType> = {};
      const allQuestions = data.docs.map(question => ({
        ...question.data(),
        id: question.id,
      })) as QuestionType[];

      allQuestions.forEach(question => {
        questionsMap[question.id] = question;
      });
      let questions: QuestionType[] | undefined = [];

      if (key === DocumentType.CATEGORY) {
        questions = sessionStore.getSessionQuestions(questionsMap);
      } else {
        const rubircquestionsIds = rubricStore.rubric?.questions;
        if (!rubircquestionsIds) {
          return;
        }

        questions = rubircquestionsIds.map(questionId => {
          return questionsMap[questionId];
        });
      }

      runInAction(() => {
        if (!questions) {
          return;
        }

        this.questions = questions;
        this.questionsSize = questions.length;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchAllQuestions = async () => {
    try {
      crashlytics().log('Fetching all questions');

      const source = await userStore.checkIsUserOfflineAndReturnSource();
      const data = await firestore()
        .collection(Collections.QUESTIONS)
        .orderBy('createdDate')
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
      errorHandler({error: e});
    }
  };

  fetchFavoritesQuestions = async () => {
    try {
      crashlytics().log('Fetching favorites questions');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const data = await firestore()
        .collection(Collections.QUESTIONS)
        .orderBy('createdDate')
        .get({source});

      const questions = data.docs.map(question => ({
        ...question.data(),
        id: question.id,
      })) as QuestionType[];

      const favoritesQuestions = this.getFavoritesQuestions(questions);
      if (!favoritesQuestions) {
        return;
      }

      runInAction(() => {
        this.questions = favoritesQuestions as QuestionType[];
        this.questionsSize = favoritesQuestions.length;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getFavoritesQuestions = (questions: QuestionType[]) => {
    const favorites = favoriteStore.favorites;
    if (!favorites) {
      return;
    }

    const questionsMap: Record<string, QuestionType> = {};
    questions.forEach(question => {
      questionsMap[question.id] = question;
    });

    const favoritesQuestions = favorites.questions.map(
      questionId => questionsMap[questionId],
    );

    return favoritesQuestions;
  };

  checkIfAllQuestionsSwiped = async (param: {questionId: string}) => {
    try {
      crashlytics().log('Checking are all questions swiped.');

      const {questionId} = param;

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

      const isLastCategory = categoryStore.getIsLastCategory();
      // we don't need any logic for last category
      if (isLastCategory) {
        return;
      }

      if (isLastQuestion) {
        const category = categoryStore.category;
        if (!category) {
          return;
        }

        // the modal will be opened only one time
        if (category.isAllQuestionsSwiped) {
          return;
        }

        this.updateUserDataAfterSwipedAllQuestions({
          categoryId: category.id,
        });

        this.setCongratsModalVisible(true);
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateUserDataAfterSwipedAllQuestions = async ({
    categoryId,
  }: {
    categoryId: string;
  }) => {
    try {
      const nextCategory = categoriesStore.getNextCategory({
        currentCategoryId: categoryId,
      });

      if (!nextCategory) {
        return;
      }

      userStore.setCurrentCategory({
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
    } catch (e) {
      errorHandler({error: e});
    }
  };

  loadAds = (param: {questionNumber: number; interstitial: InterstitialAd}) => {
    try {
      crashlytics().log('loading ads.');

      const {questionNumber, interstitial} = param;

      const diff = getNumbersDiff(questionNumber, this.breakPointForShowingAds);

      // if user has swiped 3 or more questions load ads
      if (diff >= 3) {
        interstitial.load();
        this.breakPointForShowingAds = questionNumber;
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new QuestionsStore();
