import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {Collections} from '@src/shared/types/firebase';
import {QuestionType} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {DocumentType} from '@src/shared/types/types';
import {CategoryKey, categoryStore, CategoryType} from '@src/entities/Category';
import {UserCategory, userCategoryStore} from '@src/entities/UserCategory';
import {getNextElementById} from '@src/shared/lib/common';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {
  AllSessionsType,
  MarkedSessionsMapType,
  SessionsMap,
  SessionType,
} from '../types/sessionType';

class SessionStore {
  sessions: SessionType[] = [];
  session: SessionType | null = null;
  allSessions: AllSessionsType[] = [];
  markedSessionsMap: MarkedSessionsMapType = {};
  sessionsMap: SessionsMap = {};

  constructor() {
    makeAutoObservable(this);
  }

  setSessions = (sessions: SessionType[]) => {
    this.sessions = sessions;
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

  fetchAllSessionsFromAllCategories = async ({
    categories,
    language,
  }: {
    categories: CategoryType[];
    language: LanguageValueType;
  }) => {
    try {
      crashlytics().log('Fetching all sessions from unlocked categories');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const currentCategoryId = categoryStore.category?.id;
      if (!currentCategoryId) {
        return;
      }

      const {unlockedCategoryMap, unlockedCategories} =
        this.getUnlockedCategoriesInfo(categories);

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

      // get all sessions from unlocked categories for All in One category
      const allSessions = (await Promise.all(promises)).map(item => {
        const sessions = this.formSessions({
          docs: item.docs,
          userCategories,
          categoryId: currentCategoryId,
        });

        sessions.forEach(session => {
          markedSessionsMap[session.id] = session.isMarked;
        });

        const firstCategoryId = sessions[0].categoryId;
        const category = unlockedCategoryMap[firstCategoryId];

        return {
          categoryId: firstCategoryId,
          categoryDisplayName: category ? category.displayName[language] : '',
          sessions: sessions,
          categoryName: category.name,
        };
      });

      this.setMarkedSessionsMap(markedSessionsMap);

      runInAction(() => {
        this.allSessions = allSessions;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchSessions = async () => {
    try {
      crashlytics().log('Fetching sessions');

      const userCategories = userCategoryStore.userCategory;
      const categoryId = categoryStore.category?.id;
      if (!categoryId) {
        return;
      }

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const data = await firestore()
        .collection(Collections.CATEGORIES_2)
        .doc(categoryId)
        .collection(Collections.SESSIONS)
        .get({source});

      const sessions = this.formSessions({
        docs: data.docs,
        userCategories,
        categoryId,
      });

      const markedSessionsMap: MarkedSessionsMapType = {};

      sessions.forEach(session => {
        markedSessionsMap[session.id] = session.isMarked;
      });

      this.setMarkedSessionsMap(markedSessionsMap);
      this.setSessions(sessions);
      this.getAndSetSessionsMap(sessions);
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
    docs: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[];
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

  getUnlockedCategoriesInfo = (categories: CategoryType[]) => {
    const unlockedCategories = categories.filter(category => {
      return !category.isBlocked && category.name !== CategoryKey.All_In_One;
    });

    const unlockedCategoryMap = Object.fromEntries(
      unlockedCategories.map(cat => [cat.id, cat]),
    );

    return {unlockedCategoryMap, unlockedCategories};
  };

  getSessionQuestions = (questionsMap: Record<string, QuestionType>) => {
    const session = this.session;
    if (!session) {
      return [];
    }

    const sessionQuestionsIds = session.questions;

    const questions = sessionQuestionsIds.map(questionId => {
      return questionsMap[questionId];
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
    categoryId,
    sessionId,
  }: {
    categoryId: string;
    sessionId: string;
  }) => {
    try {
      crashlytics().log('Updating user session');

      const sessions = this.sessions;

      const nextSession = getNextElementById<SessionType>({
        id: sessionId,
        array: sessions,
      });

      if (!nextSession) {
        return;
      }
      const nextSessionId = nextSession.id;

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
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new SessionStore();
