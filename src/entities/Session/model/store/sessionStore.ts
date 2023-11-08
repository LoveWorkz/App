import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {Collections, DocsType} from '@src/shared/types/firebase';
import {QuestionType} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {DocumentType} from '@src/shared/types/types';
import {categoryStore, CategoryType} from '@src/entities/Category';
import {UserCategory, userCategoryStore} from '@src/entities/UserCategory';
import {getNextElementById} from '@src/shared/lib/common';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {inAppReviewStore} from '@src/features/InAppReview';
import {
  AllSessionsType,
  MarkedSessionsMapType,
  SessionsMap,
  SessionType,
} from '../types/sessionType';
import {
  sessionsCountWithoutSubscription,
  sessionsCountWithSubscription,
  SESSION_INTERVAL_FOR_RATE_PROMPT,
} from '../lib/sessionLib';

class SessionStore {
  sessions: SessionType[] = [];
  session: SessionType | null = null;
  allSessionsFromAllCategories: SessionType[] = [];
  allInOneSessions: AllSessionsType[] = [];
  markedSessionsMap: MarkedSessionsMapType = {};
  sessionsMap: SessionsMap = {};

  allSessions: SessionType[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setSessions = (sessions: SessionType[]) => {
    this.sessions = sessions;
  };

  setAllSessions = (allSessions: SessionType[]) => {
    this.allSessions = allSessions;
  };

  getAndSetSessionsMap = (sessions: SessionType[]) => {
    const sessionsMap: SessionsMap = {};
    sessions.forEach(session => {
      sessionsMap[session.id] = session;
    });

    this.sessionsMap = sessionsMap;
  };

  getSession = (sessionId: string) => {
    const session = this.sessionsMap[sessionId];
    return session;
  };

  getAndSetSession = (sessionId: string) => {
    const session = this.getSession(sessionId);
    this.setSession(session);
  };

  setMarkedSessionsMap = (markedSessionsMap: MarkedSessionsMapType) => {
    this.markedSessionsMap = markedSessionsMap;
  };

  updateMarkedSessionsMap = ({key, value}: {key: string; value: boolean}) => {
    this.markedSessionsMap[key] = value;
  };

  setSession = (session: SessionType) => {
    this.session = session;
  };

  getUserSessionsCount = () => {
    const hasUserSubscription = userStore.checkIfUserHasSubscription();

    return hasUserSubscription
      ? sessionsCountWithSubscription
      : sessionsCountWithoutSubscription;
  };

  selectSession = ({session}: {session: SessionType}) => {
    const categoryId = categoryStore.category?.id;
    if (!categoryId) {
      return;
    }

    this.setSession(session);
    navigation.navigate(AppRouteNames.QUESTIONS, {
      type: DocumentType.CATEGORY,
      id: categoryId,
    });
  };

  filterSessionsBySubscription = (sessions: SessionType[]) => {
    const hasUserSubscription = userStore.checkIfUserHasSubscription();
    if (!hasUserSubscription) {
      return (sessions = sessions.slice(0, 4));
    }

    return sessions;
  };

  fetchAllSessionsFromAllCategories = async ({
    unlockedCategories,
    language,
  }: {
    unlockedCategories: CategoryType[];
    language: LanguageValueType;
  }) => {
    try {
      crashlytics().log('Fetching all sessions from unlocked categories');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const currentCategoryId = categoryStore.category?.id;
      if (!currentCategoryId) {
        return;
      }

      const unlockedCategoryMap =
        this.getUnlockedCategoriesMap(unlockedCategories);

      const promises: Promise<
        FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>
      >[] = [];

      unlockedCategories.forEach(category => {
        const data = firestore()
          .collection(Collections.CATEGORIES_2)
          .doc(category.id)
          .collection(Collections.SESSIONS)
          .get({source});

        promises.push(data);
      });

      const userCategories = userCategoryStore.userCategory;
      const markedSessionsMap: MarkedSessionsMapType = {};
      const allSessionsFromAllCategories: SessionType[] = [];

      // get all sessions from unlocked categories for All in One category
      const allInOneSessions = (await Promise.all(promises)).map(item => {
        const sessions = this.formSessions({
          docs: item.docs,
          userCategories,
          categoryId: currentCategoryId,
        });

        const filteredSessions = this.filterSessionsBySubscription(sessions);

        filteredSessions.forEach(session => {
          markedSessionsMap[session.id] = session.isMarked;
        });

        const firstCategoryId = filteredSessions[0].categoryId;
        const category = unlockedCategoryMap[firstCategoryId];

        allSessionsFromAllCategories.push(...filteredSessions);

        return {
          categoryId: firstCategoryId,
          categoryDisplayName: category ? category.displayName[language] : '',
          sessions: filteredSessions,
          categoryName: category.name,
        };
      });

      this.setMarkedSessionsMap(markedSessionsMap);

      runInAction(() => {
        this.allInOneSessions = allInOneSessions;
        this.allSessionsFromAllCategories = allSessionsFromAllCategories;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchSessions = async () => {
    try {
      crashlytics().log('Fetching sessions');
      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const userCategories = userCategoryStore.userCategory;
      const categoryId = categoryStore.category?.id;
      if (!categoryId) {
        return;
      }

      const data = await firestore()
        .collection(Collections.CATEGORIES_2)
        .doc(categoryId)
        .collection(Collections.SESSIONS)
        .get({source});

      let sessions = this.formSessions({
        docs: data.docs,
        userCategories,
        categoryId,
      });

      const allSessions = sessions;
      const markedSessionsMap: MarkedSessionsMapType = {};

      const filteredSessions = this.filterSessionsBySubscription(sessions);

      filteredSessions.forEach(session => {
        markedSessionsMap[session.id] = session.isMarked;
      });

      this.setMarkedSessionsMap(markedSessionsMap);
      this.setSessions(filteredSessions);
      this.getAndSetSessionsMap(filteredSessions);

      this.setAllSessions(allSessions);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  sortSessions = (sessions: SessionType[]) => {
    const sortedSessions = [...sessions].sort(
      (a, b) => a.sessionNumber - b.sessionNumber,
    );

    return sortedSessions;
  };

  formSessions = ({
    docs,
    userCategories,
    categoryId,
  }: {
    docs: DocsType;
    userCategories: UserCategory | null;
    categoryId: string;
  }) => {
    if (!userCategories) {
      return [];
    }

    const userSessions = userCategories.categories[categoryId].sessions;
    if (!userSessions) {
      return [];
    }
    // merge default and user sessions together
    const sessions = docs.map(doc => {
      const docId = doc.id.trim();
      return {...doc.data(), ...userSessions[docId], id: docId};
    }) as SessionType[];

    const sortedSessions = this.sortSessions(sessions);
    return sortedSessions;
  };

  getUnlockedCategoriesMap = (unlockedCategories: CategoryType[]) => {
    const unlockedCategoryMap = Object.fromEntries(
      unlockedCategories.map(cat => [cat.id, cat]),
    );

    return unlockedCategoryMap;
  };

  getSessionQuestions = (questionsMap: Record<string, QuestionType>) => {
    const session = this.session;
    if (!session) {
      return [];
    }

    const sessionQuestionsIds = session.questions;

    const questions = sessionQuestionsIds.map(questionId => {
      const question = questionsMap[questionId];

      return {
        ...question,
        challenge: question.type === 'CHALLENGE_CARD' ? session.challenge : '',
      };
    });

    return questions;
  };

  markSession = async ({
    sessionId,
    isMarked,
  }: {
    sessionId: string;
    isMarked: boolean;
  }) => {
    try {
      crashlytics().log('Mark session');

      const categoryId = categoryStore.category?.id;
      if (!categoryId) {
        return;
      }

      const newMarkedValue = !isMarked;

      this.updateMarkedSessionsMap({key: sessionId, value: newMarkedValue});

      await userCategoryStore.updateUserCategory({
        id: categoryId,
        data: newMarkedValue,
        field: `sessions.${sessionId}.isMarked`,
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateUserSessionAfterSwipedAllQuestions = async ({
    category,
    sessionId,
  }: {
    category: CategoryType;
    sessionId: string;
  }) => {
    try {
      crashlytics().log('Updating user session');

      const categoryId = category.id;

      const isLastCategory = categoryStore.getIsLastCategoryByKey(
        category.name,
      );
      let sessions = this.sessions;

      if (isLastCategory) {
        sessions = this.allSessionsFromAllCategories;
      }

      const nextSession = getNextElementById<SessionType>({
        id: sessionId,
        array: sessions,
      });

      if (!nextSession) {
        return;
      }
      const nextSessionId = nextSession.id;

      this.checkSessionsAndShowRatePopup(category);

      await userCategoryStore.updateUserCategory({
        id: categoryId,
        field: `sessions.${sessionId}.isAllQuestionsSwiped`,
        data: true,
      });

      await userCategoryStore.updateUserCategory({
        id: categoryId,
        field: `sessions.${nextSessionId}.isBlocked`,
        data: false,
      });

      await userCategoryStore.updateUserCategory({
        id: categoryId,
        field: 'currentSession',
        data: nextSessionId,
      });

      await userCategoryStore.updateUserCategory({
        id: categoryId,
        field: 'currentSessionNumber',
        data: nextSession.sessionNumber,
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  checkSessionsAndShowRatePopup = async (category: CategoryType) => {
    const user = userStore.user;
    // user can rate the app only once
    if (user?.hasUserRated) {
      return;
    }

    const currentSessionNumber = category.currentSessionNumber;
    const ratePopUpBreakpoint = category.ratePopUpBreakpoint;
    const categoryId = category.id;

    const newRatePopUpBreakpoint =
      ratePopUpBreakpoint + SESSION_INTERVAL_FOR_RATE_PROMPT;

    if (
      newRatePopUpBreakpoint - currentSessionNumber ===
      SESSION_INTERVAL_FOR_RATE_PROMPT
    ) {
      const actionAfterRating = () => {
        userStore.updateUser({
          field: 'hasUserRated',
          data: true,
        });
      };

      inAppReviewStore.rate(actionAfterRating);

      await userCategoryStore.updateUserCategory({
        id: categoryId,
        field: 'ratePopUpBreakpoint',
        data: newRatePopUpBreakpoint,
      });
    }
  };
}

export default new SessionStore();
