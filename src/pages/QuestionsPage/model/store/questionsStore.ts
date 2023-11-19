import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import {InterstitialAd} from 'react-native-google-mobile-ads';
import crashlytics from '@react-native-firebase/crashlytics';

import {Collections, DocsType} from '@src/shared/types/firebase';
import {CategoryKey, categoryStore, CategoryType} from '@src/entities/Category';
import {rubricStore} from '@src/entities/Rubric';
import {favoriteStore} from '@src/entities/Favorite';
import {
  QuestionsMapType,
  questionStore,
  QuestionType,
} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {userRubricStore} from '@src/entities/UserRubric';
import {userCategoryStore} from '@src/entities/UserCategory';
import {wowThatWasFastModalStore} from '@src/widgets/WowThatWasFastModal';
import {DocumentType} from '@src/shared/types/types';
import {getNextElementById, getNumbersDiff} from '@src/shared/lib/common';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {sessionStore, SessionType} from '@src/entities/Session';
import {userChallengeCategoryStore} from '@src/entities/UserChallengeCategory';
import {challengeStore} from '@src/entities/Challenge';

class QuestionsStore {
  questions: QuestionType[] = [];
  congratsModalVisible: boolean = false;
  questionsPageloading: boolean = true;
  allQuestions: QuestionType[] = [];
  allQuestionsMap: QuestionsMapType = {};

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
    sharedQuestionId?: string;
    sessionId?: string;
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
    sharedQuestionId,
    sessionId,
  }: {
    id?: string;
    key: DocumentType;
    language: LanguageValueType;
    sharedQuestionId?: string;
    sessionId?: string;
  }) => {
    try {
      switch (key) {
        case DocumentType.RUBRIC:
          if (!id) {
            return;
          }
          rubricStore.getAndSetRubric(id);
          await this.fetchSpecificQuestions({
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
          if (!(id && sessionId)) {
            return;
          }

          // if a user opened a shared link
          if (sharedQuestionId) {
            categoryStore.getAndSetCategory({id});
          }
          await this.fetchSpecificQuestions({
            key: DocumentType.CATEGORY,
            sharedQuestionId,
          });

          // init current question id for the first time
          await categoryStore.initUserCategoryQuestionId({
            id,
            questions: this.questions,
            sessionId,
          });
          // init questions page info
          categoryStore.getQuestionSwipeInfoForCategory({
            sharedQuestionId,
            questions: this.questions,
            language,
            sessionId,
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
      const sessionId = sessionStore.session?.id;

      if (!(question && sessionId)) {
        return;
      }

      // this.loadAds({questionNumber, interstitial});

      if (key !== DocumentType.FAVORITE && documentId) {
        wowThatWasFastModalStore.wowThatWasFastLogic({
          documentId,
          type: key,
          questions: this.questions,
          questionId: question.id,
          sessionId,
        });
      }

      switch (key) {
        case DocumentType.CATEGORY:
          this.categorySwipeLogic({...swipeData, sessionId});
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
    sessionId: string;
  }) => {
    try {
      crashlytics().log('Swiping category questions.');

      const {question, language, sessionId} = categorySwipeParam;

      const currentCategory = categoryStore.category;
      if (!currentCategory) {
        return;
      }

      categoryStore.getQuestionSwipeInfoForCategory({
        questionId: question.id,
        questions: this.questions,
        language,
        sessionId,
      });

      await userCategoryStore.updateUserCategory({
        id: currentCategory.id,
        data: question.id,
        field: `sessions.${sessionId}.currentQuestion`,
      });

      this.checkIfAllQuestionsSwiped({
        questionId: question.id,
        sessionId,
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
    key,
    sharedQuestionId,
  }: {
    key: DocumentType;
    sharedQuestionId?: string;
  }) => {
    try {
      const allQuestionsMap = this.allQuestionsMap;
      let questions: QuestionType[] | undefined = [];

      if (sharedQuestionId) {
        // if a user opened a shared link
        questions = [allQuestionsMap[sharedQuestionId]];
      } else if (key === DocumentType.CATEGORY) {
        questions = sessionStore.getSessionQuestions(allQuestionsMap);
      } else {
        const rubircquestionsIds = rubricStore.rubric?.questions;
        if (!rubircquestionsIds) {
          return;
        }

        questions = rubircquestionsIds.map(questionId => {
          return allQuestionsMap[questionId];
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

  fetchAllQuestionsInfo = async () => {
    try {
      const allQuestions = await this.fetchAllQuestions();
      const allQuestionsMap = this.getQuestionsMap(allQuestions);

      runInAction(() => {
        this.allQuestions = allQuestions as QuestionType[];
        this.allQuestionsMap = allQuestionsMap;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchAllQuestions = async () => {
    crashlytics().log('Fetching all questions');

    const source = await userStore.checkIsUserOfflineAndReturnSource();

    // fetch and merge all questions

    const promise1 = firestore()
      .collection(Collections.ORDINARY_QUESTIONS)
      .get({source});
    const promise2 = firestore()
      .collection(Collections.WILD_QUESTIONS)
      .get({source});
    const promise3 = firestore()
      .collection(Collections.CHALLENGE_QUESTIONS)
      .get({source});
    const promise4 = firestore()
      .collection(Collections.RUBRIC_QUESTIONS)
      .get({source});

    const data = await Promise.all([promise1, promise2, promise3, promise4]);
    const allQuestions: DocsType = [];

    data.forEach(element => {
      allQuestions.push(...element.docs);
    });

    const result = allQuestions.map(question => ({
      ...question.data(),
      id: question.id,
    })) as QuestionType[];

    return result;
  };

  getQuestionsMap = (questions: QuestionType[]) => {
    const questionsMap: QuestionsMapType = {};
    questions.forEach(question => {
      questionsMap[question.id] = question;
    });

    return questionsMap;
  };

  fetchFavoritesQuestions = async () => {
    try {
      crashlytics().log('Fetching favorites questions');

      const favoritesQuestions = this.getFavoritesQuestions();
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

  getFavoritesQuestions = () => {
    const favorites = favoriteStore.favorites;
    if (!favorites) {
      return;
    }

    const allQuestionsMap = this.allQuestionsMap;

    const favoritesQuestions = favorites.questions.map(
      questionId => allQuestionsMap[questionId],
    );

    return favoritesQuestions;
  };

  getIsLastSession = ({
    sessionNumber,
    isLastCategory,
  }: {
    sessionNumber: number;
    isLastCategory: boolean;
  }) => {
    const sessionsCount = sessionStore.getUserSessionsCount();

    let lastSessionNumber = sessionsCount;
    const unlockedCategories = categoriesStore.unlockedCategories;

    if (isLastCategory) {
      lastSessionNumber = sessionsCount * unlockedCategories.length;
    }

    return sessionNumber === lastSessionNumber;
  };

  shouldProceedToNextCategory = ({
    category,
    isLastCategory,
  }: {
    category: CategoryType;
    isLastCategory: boolean;
  }) => {
    return (
      category.name !== CategoryKey.Intimate &&
      category.name !== CategoryKey.Specials &&
      !isLastCategory
    );
  };

  checkIfAllQuestionsSwiped = async (param: {
    questionId: string;
    sessionId: string;
  }) => {
    try {
      crashlytics().log('Checking are all questions swiped.');

      const {questionId, sessionId} = param;

      const questionInfo = questionStore.getQuestionInfo({
        questionId,
        questions: this.questions,
      });
      if (!questionInfo) {
        return;
      }

      // if it's not last question exit
      if (questionInfo.currentQuestionNumber !== this.questionsSize) {
        return;
      }

      const category = categoryStore.category;
      const session = sessionStore.session;

      if (!(category && session)) {
        return;
      }

      const isLastCategory = categoryStore.getIsLastCategoryByKey(
        category.name,
      );
      const isLastSession = this.getIsLastSession({
        sessionNumber: session.sessionNumber,
        isLastCategory,
      });

      if (isLastSession) {
        const hasUserSubscription = userStore.checkIfUserHasSubscription();
        if (!hasUserSubscription) {
          return;
        }

        if (category.name === CategoryKey.Intimate) {
          if (session.challenge.isChallengeSpecial) {
            await challengeStore.updateSpecialChallenge({
              id: session.challenge.challengeId,
              value: false,
              field: 'isBlocked',
            });
          }
        }

        // if the category is “All in one” || Hot || Intimate, we don't need to update the next category
        const canOpenNextCategory = this.shouldProceedToNextCategory({
          category,
          isLastCategory,
        });

        // if we update a category once, we won't need to update it again
        const isAllSessionsPassed = category.isAllSessionsPassed;

        if (!canOpenNextCategory || isAllSessionsPassed) {
          return;
        }

        this.updateUserDataAfterSwipedAllQuestions({
          categoryId: category.id,
          session,
        });
        this.setCongratsModalVisible(true);
        return;
      }

      if (category.sessions[sessionId].isAllQuestionsSwiped) {
        return;
      }

      sessionStore.updateUserSessionAfterSwipedAllQuestions({
        category,
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateUserDataAfterSwipedAllQuestions = async ({
    categoryId,
    session,
  }: {
    categoryId: string;
    session: SessionType;
  }) => {
    try {
      const categories = categoriesStore.categories;
      const nextCategory = getNextElementById<CategoryType>({
        id: categoryId,
        array: categories,
      });

      if (!nextCategory) {
        return;
      }

      userStore.setCurrentCategory({
        currentCategory: nextCategory.name,
      });

      await userCategoryStore.updateUserCategory({
        id: categoryId,
        field: 'isAllSessionsPassed',
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

      await userChallengeCategoryStore.updateUserChallengeCategory({
        field: 'isBlocked',
        data: false,
        challengeCategoryName: nextCategory.name,
      });

      if (session.challenge.isChallengeSpecial) {
        await challengeStore.updateSpecialChallenge({
          id: session.challenge.challengeId,
          value: false,
          field: 'isBlocked',
        });
      }
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
