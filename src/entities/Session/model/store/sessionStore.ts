import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {Collections, DocsType} from '@src/shared/types/firebase';
import {challengeCard, QuestionType} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {DocumentType} from '@src/shared/types/types';
import {categoryStore, CategoryType} from '@src/entities/Category';
import {UserCategory, userCategoryStore} from '@src/entities/UserCategory';
import {getNextElementById} from '@src/shared/lib/common';
import {inAppReviewStore} from '@src/features/InAppReview';
import {
  challengeStore,
  ChallengeType,
  SpecialChallengeType,
} from '@src/entities/Challenge';
import {SessionsMap, SessionType} from '../types/sessionType';
import {
  sessionsCountWithoutSubscription,
  sessionsCountWithSubscription,
  SESSION_INTERVAL_FOR_RATE_PROMPT,
} from '../lib/sessionLib';

class SessionStore {
  sessions: SessionType[] = [];
  session: SessionType | null = null;
  allSessionsFromAllCategories: SessionType[] = [];
  sessionsMap: SessionsMap = {};
  sessionChallenge?: ChallengeType | SpecialChallengeType;

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

  fetchSessionChallenge = async () => {
    try {
      crashlytics().log('Fetching session challenge');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const sessionChallengeInfo = this.session?.challenge;
      const challengeCategoryId = categoryStore.category?.challengeCategoryId;
      if (!(sessionChallengeInfo && challengeCategoryId)) {
        return;
      }

      const challenge = await firestore()
        .collection(Collections.CHALLENGE_CATEGORIES)
        .doc(challengeCategoryId)
        .collection(
          sessionChallengeInfo.isChallengeSpecial
            ? Collections.SPECIAL_CHALLENGES
            : Collections.CORE_CHALLENGES,
        )
        .doc(sessionChallengeInfo.challengeId)
        .get({source});

      const sessionChallenge = challenge.data() as
        | ChallengeType
        | SpecialChallengeType;

      runInAction(() => {
        this.sessionChallenge = sessionChallenge;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  getAndSetSession = (sessionId: string) => {
    const session = this.getSession(sessionId);
    this.setSession(session);
  };

  setSession = (session: SessionType) => {
    this.session = session;
  };

  getUserSessionsCount = () => {
    const hasUserSubscription = userStore.getUserHasSubscription();

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
    const hasUserSubscription = userStore.getUserHasSubscription();
    if (!hasUserSubscription) {
      return (sessions = sessions.slice(0, 4));
    }

    return sessions;
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

      const filteredSessions = this.filterSessionsBySubscription(sessions);

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

  getSessionQuestions = (
    questionsMap: Record<string, QuestionType>,
  ): QuestionType[] => {
    const session = this.session;
    if (!session) {
      return [];
    }
    // delete this line after deleting challenge questions from firebase from firebase
    session.questions.pop();
    const sessionQuestionsIds = session.questions;

    const questions = sessionQuestionsIds.map(questionId => {
      const question = questionsMap[questionId];

      // return {
      //   ...question,
      //   challenge:
      //     question.type === 'CHALLENGE_CARD'
      //       ? session.challenge.challengeId
      //       : '',
      // };

      return question;
    });

    const questionsWithChallengeCard = [
      ...questions,
      {
        ...challengeCard,
        challenge: session.challenge.challengeId,
        categoryId: session.categoryId,
      },
    ];

    return questionsWithChallengeCard;
  };

  updateUserSessionAfterSwipedAllQuestions = async ({
    category,
  }: {
    category: CategoryType;
  }) => {
    try {
      crashlytics().log('Updating user session');

      const categoryId = category.id;

      const isLastCategory = categoryStore.getIsLastCategoryByKey(
        category.name,
      );
      let sessions = this.sessions;
      const currentSession = this.session;
      if (!currentSession) {
        return;
      }

      if (isLastCategory) {
        sessions = this.allSessionsFromAllCategories;
      }

      const nextSession = getNextElementById<SessionType>({
        id: currentSession.id,
        array: sessions,
      });

      if (!nextSession) {
        return;
      }

      await this.checkSessionsAndShowRatePopup(category);
      await this.updateSessionsData({categoryId, nextSession, currentSession});
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateSessionsData = async ({
    categoryId,
    currentSession,
    nextSession,
  }: {
    categoryId: string;
    currentSession: SessionType;
    nextSession: SessionType;
  }) => {
    const promise1 = userCategoryStore.updateUserCategory({
      id: categoryId,
      field: `sessions.${currentSession.id}.isAllQuestionsSwiped`,
      data: true,
    });

    const promise2 = userCategoryStore.updateUserCategory({
      id: categoryId,
      field: `sessions.${nextSession.id}.isBlocked`,
      data: false,
    });

    const promise3 = userCategoryStore.updateUserCategory({
      id: categoryId,
      field: 'currentSession',
      data: nextSession.id,
    });

    const promise4 = userCategoryStore.updateUserCategory({
      id: categoryId,
      field: 'currentSessionNumber',
      data: nextSession.sessionNumber,
    });

    // after completing a session, set a finish date
    const promise5 = userStore.setNotification({
      field: 'lastSessionDate',
      value: new Date(),
    });

    if (currentSession.challenge.isChallengeSpecial) {
      await challengeStore.updateSpecialChallenge({
        id: currentSession.challenge.challengeId,
        value: false,
        field: 'isBlocked',
      });
    }

    await Promise.all([promise1, promise2, promise3, promise4, promise5]);
  };

  checkSessionsAndShowRatePopup = async (category: CategoryType) => {
    const user = userStore.user;
    // If the user has already rated the app, do nothing.
    if (user?.hasUserRated) {
      return;
    }

    const isRatePromptSession = await this.showRatePopup(
      category.currentSessionNumber,
    );

    if (isRatePromptSession) {
      await inAppReviewStore.rate();

      // Calculate the next session number when the rate popup should be shown again.
      const nextRatePopupSession =
        category.currentSessionNumber + SESSION_INTERVAL_FOR_RATE_PROMPT;

      await userCategoryStore.updateUserCategory({
        id: category.id,
        field: 'ratePopUpBreakpoint',
        data: nextRatePopupSession,
      });
    }
  };

  showRatePopup = async (currentSessionNumber: number) => {
    // Check if it's the correct session to prompt the rate popup based on the interval.
    return currentSessionNumber % SESSION_INTERVAL_FOR_RATE_PROMPT === 0;
  };
}

export default new SessionStore();
