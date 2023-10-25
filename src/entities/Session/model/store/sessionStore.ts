import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {Collections} from '@src/shared/types/firebase';
import {QuestionType} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {DocumentType} from '@src/shared/types/types';
import {categoryStore} from '@src/entities/Category';
import {userCategoryStore} from '@src/entities/UserCategory';
import {getNextElementById} from '@src/shared/lib/common';
import {SessionType} from '../types/sessionType';

class SessionStore {
  sessions: SessionType[] = [];
  session: SessionType | null = null;

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

      const sortedSessions = [...sessions].sort(
        (a, b) => a.sessionNumber - b.sessionNumber,
      );

      runInAction(() => {
        this.sessions = sortedSessions;
      });
    } catch (e) {
      errorHandler({error: e});
    }
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
