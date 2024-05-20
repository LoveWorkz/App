import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import {InterstitialAd} from 'react-native-google-mobile-ads';
import crashlytics from '@react-native-firebase/crashlytics';

import {Collections, DocsType} from '@src/shared/types/firebase';
import {categoryStore} from '@src/entities/Category';
import {rubricStore} from '@src/entities/Rubric';
import {favoriteStore} from '@src/entities/Favorite';
import {
  QuestionsMapType,
  BasicQuestionType,
  questionStore,
  QuestionType,
} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {userRubricStore} from '@src/entities/UserRubric';
import {DocumentType} from '@src/shared/types/types';
import {getNumbersDiff} from '@src/shared/lib/common';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {sessionStore} from '@src/entities/Session';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {wowThatWasFastModalStore} from '@src/widgets/WowThatWasFastModal';

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
    setIsGradient: (isGradient: boolean) => void;
  }) => {
    try {
      crashlytics().log('Fetching questions page');

      runInAction(() => {
        this.questionsPageloading = true;
      });

      await this.getQuestionsPageInfo(param);
      await sessionStore.fetchSessionChallenge();
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
    sharedQuestionId,
    setIsGradient,
  }: {
    id?: string;
    key: DocumentType;
    sharedQuestionId?: string;
    setIsGradient: (isGradient: boolean) => void;
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
            questions: this.questions,
          });
          break;
        case DocumentType.CATEGORY:
          const currentSession = sessionStore.session;
          if (!(id && currentSession)) {
            return;
          }

          // if a user opened a shared link
          if (sharedQuestionId) {
            categoryStore.getAndSetCategory({id});
          }

          this.fetchSpecificQuestions({
            key: DocumentType.CATEGORY,
            sharedQuestionId,
          });

          // Initialize the first question ID in the session. This is only done once when the session first starts
          // to ensure the user starts with the correct question.
          await categoryStore.initSessionQuestion({
            questions: this.questions,
            levelId: id,
            session: currentSession,
          });

          // init questions page info
          categoryStore.getQuestionSwipeInfoForCategory({
            sharedQuestionId,
            questions: this.questions,
            setIsGradient,
          });

          break;
        default:
          await this.fetchFavoritesQuestions();
          favoriteStore.getQuestionSwipeInfoForFavorites({
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
    setIsGradient: (isGradient: boolean) => void;
  }) => {
    try {
      crashlytics().log('Swiping question.');

      // if the user swipes the last card, redirect to the Break page.
      if (swipeData.question.type === 'EMPTY_CARD') {
        navigation.navigate(AppRouteNames.BREAK);

        return;
      }

      const {question, questionNumber, interstitial, key, documentId} =
        swipeData;
      const sessionId = sessionStore.session?.id;

      if (!question) {
        return;
      }

      // this.loadAds({ questionNumber, interstitial });

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
          if (!sessionId) {
            return;
          }

          this.levelSwipeLogic({...swipeData, sessionId});
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

  levelSwipeLogic = async (levelSwipeParam: {
    question: QuestionType;
    key: DocumentType;
    sessionId: string;
    setIsGradient: (isGradient: boolean) => void;
  }) => {
    try {
      crashlytics().log('Swiping level questions.');

      const {question, sessionId, setIsGradient} = levelSwipeParam;

      const currentLevel = categoryStore.category;
      if (!currentLevel) {
        return;
      }

      categoryStore.getQuestionSwipeInfoForCategory({
        questionId: question.id,
        questions: this.questions,
        setIsGradient,
      });

      this.checkAndResetNotificationDate();

      await sessionStore.updateSessionField({
        levelId: currentLevel.id,
        sessionId,
        fieldName: 'currentQuestion',
        fieldValue: question.id,
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  rubricSwipeLogic = async (rubricSwipeParam: {
    question: QuestionType;
    key: DocumentType;
  }) => {
    try {
      crashlytics().log('Swiping rubric questions.');

      const {question} = rubricSwipeParam;

      rubricStore.getQuestionSwipeInfoForRubric({
        questionId: question.id,
        questions: this.questions,
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
  }) => {
    try {
      crashlytics().log('Swiping favorites questions.');

      const {question} = favoritesSwipeParam;

      favoriteStore.getQuestionSwipeInfoForFavorites({
        id: question.id,
        questions: this.questions,
      });

      await userRubricStore.updateUserRubricFavorites({
        field: 'currentQuestion',
        data: question.id,
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchSpecificQuestions = ({
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

      // remove empty elements
      const filteredQuestions = questions.filter(question => question);

      runInAction(() => {
        if (!filteredQuestions) {
          return;
        }

        this.questions = filteredQuestions;
        this.questionsSize = filteredQuestions.length;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchAllQuestionsInfo = async () => {
    try {
      const allQuestions = await this.fetchAllQuestions();

      // Enrich the basic questions with detailed category and rubric information.
      const enrichedQuestions = questionStore.enrichQuestionsWithDetails({
        questions: allQuestions,
        rubricsMap: rubricStore.rubricsMap,
        categoriesMap: categoriesStore.categoriesMap,
      });

      const allQuestionsMap = this.getQuestionsMap(enrichedQuestions);

      runInAction(() => {
        this.allQuestions = enrichedQuestions as QuestionType[];
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
    const promise4 = firestore()
      .collection(Collections.RUBRIC_QUESTIONS)
      .get({source});

    const data = await Promise.all([promise1, promise2, promise4]);
    const allQuestions: DocsType = [];

    data.forEach(element => {
      allQuestions.push(...element.docs);
    });

    const result = allQuestions.map(question => ({
      ...question.data(),
      id: question.id,
    })) as BasicQuestionType[];

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

    const favoritesQuestions = favorites.ids.map(
      questionId => allQuestionsMap[questionId],
    );

    return favoritesQuestions;
  };

  checkAndResetNotificationDate = async () => {
    const user = userStore.user;
    const currentCategory = categoryStore.category;
    const currentSession = sessionStore.session;

    if (!(user && currentCategory && currentSession)) {
      return;
    }

    const lastSessionDate = user.notification.lastSessionDate;
    if (!lastSessionDate) {
      return;
    }

    // if user opened already passed category then we should not reset lastSessionDate field
    const lastPassedCategoryName = user.category.currentCategory;
    if (lastPassedCategoryName !== currentCategory.name) {
      return;
    }

    // if user opened already passed session then we should not reset lastSessionDate field
    const lastPassedSessionId = currentCategory.currentSession;
    if (currentSession.id !== lastPassedSessionId) {
      return;
    }
    userStore.setNotification({field: 'lastSessionDate', value: ''});
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
