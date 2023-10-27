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
import {userCategoryStore} from '@src/entities/UserCategory';
import {getNextElementById} from '@src/shared/lib/common';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {AllSessionsType, SessionType} from '../types/sessionType';

class SessionStore {
  sessions: SessionType[] = [];
  session: SessionType | null = null;
  allSessions: AllSessionsType[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setSessions = (sessions: SessionType[]) => {
    this.sessions = sessions;
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

      // get all sessions from unlocked categories for All in One category
      const allSessions = (await Promise.all(promises)).map(item => {
        const sessions = item.docs.map(doc => {
          const docId = doc.id.trim();
          return {...doc.data(), id: docId};
        }) as SessionType[];

        const sortedSessions = this.sortSessions(sessions);

        const categoryId = sortedSessions[0].categoryId;
        const category = unlockedCategoryMap[categoryId];

        return {
          categoryId,
          categoryDisplayName: category ? category.displayName[language] : '',
          sessions: sortedSessions,
          categoryName: category.name,
        };
      });

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

      const userCategories = userCategoryStore.userCategory;
      if (!userCategories) {
        return;
      }

      const userSessions = userCategories.categories[categoryId].sessions;
      if (!userSessions) {
        return;
      }

      // merge default and user sessions together
      const sessions = data.docs.map(doc => {
        const docId = doc.id.trim();
        return {...doc.data(), ...userSessions[docId], id: docId};
      }) as SessionType[];

      const sortedSessions = this.sortSessions(sessions);

      runInAction(() => {
        this.sessions = sortedSessions;
      });
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

      await userCategoryStore.updateUserCategory({
        id: categoryId,
        data: newMarkedValue,
        field: `sessions.${sessionId}.isMarked`,
      });

      runInAction(() => {
        const markedSessions = this.sessions.map(session => {
          if (sessionId === session.id) {
            return {...session, isMarked: newMarkedValue};
          }

          return session;
        });

        this.sessions = markedSessions;
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
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new SessionStore();
