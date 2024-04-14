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
import {userCategoryStore} from '@src/entities/UserCategory';
import {getNextElementById} from '@src/shared/lib/common';
import {inAppReviewStore} from '@src/features/InAppReview';
import {
  challengeStore,
  ChallengeType,
  SpecialChallengeType,
} from '@src/entities/Challenge';
import {QuadrantType, SessionsMap, SessionType} from '../types/sessionType';
import {
  sessionsCountWithoutSubscription,
  sessionsCountWithSubscription,
  SESSION_INTERVAL_FOR_RATE_PROMPT,
} from '../lib/sessionLib';

class SessionStore {
  quadrants: QuadrantType[] = [];
  sessions: SessionType[] = [];
  session: SessionType | null = null;
  allSessionsFromAllCategories: SessionType[] = [];
  sessionsMap: SessionsMap = {};
  sessionChallenge?: ChallengeType | SpecialChallengeType;
  isFetching: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setIsFetching = (isFetching: boolean) => {
    this.isFetching = isFetching;
  };

  setQuadrants = (quadrants: QuadrantType[]) => {
    this.quadrants = quadrants;
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

  getAllSessionsCount = () => {
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

  fetchQuadrants = async (levelId: string) => {
    try {
      crashlytics().log('Fetching Quadrants');
      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const userId = userStore.userId;

      await userCategoryStore.fetchUserLevel(userId, levelId);
      const userLevel = userCategoryStore.userLevel;

      const categoryId = categoryStore.category?.id;
      if (!(userLevel && categoryId)) {
        return [];
      }

      const userQuadrants = userLevel.quadrants;
      const hasUserSubscription = userStore.getUserHasSubscription();

      const data = await firestore()
        .collection(Collections.QUADRANTS)
        .get({source});

      const quadrants = data.docs.map((doc, i) => {
        const quadrant = doc.data() as QuadrantType;
        const isFirstQuadrant = i === 0;

        const isPremium: boolean =
          categoryStore.isFirstLevel(levelId) && isFirstQuadrant
            ? false
            : !hasUserSubscription;

        return {
          ...quadrant,
          ...userQuadrants[doc.id],
          isPremium,
          sessions: [] as SessionType[],
        };
      }) as QuadrantType[];

      this.setQuadrants(quadrants);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchSessions = async (levelId: string) => {
    try {
      const userId = userStore.userId;

      await userCategoryStore.fetchUserSessions(userId, levelId);
      await this.fetchDefaultSessionsAndMergeWithUserSessions(levelId);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchDefaultSessionsAndMergeWithUserSessions = async (levelId: string) => {
    crashlytics().log('Fetching and merge sessions');
    const source = await userStore.checkIsUserOfflineAndReturnSource();

    const userSessions = userCategoryStore.userSessions;
    if (!userSessions) {
      return [];
    }

    try {
      const db = firestore();

      const quadrants = this.quadrants;
      const hasUserSubscription = userStore.getUserHasSubscription();

      let allSessionsCount = 0;

      const quadrantSessionsPromises = quadrants.map(quadrant => {
        return db
          .collection(Collections.LEVELS)
          .doc(levelId)
          .collection(Collections.QUADRANTS_SESSIONS)
          .doc(`${quadrant.id}_sessions`)
          .collection(Collections.SESSIONS)
          .get({source})
          .then(sessionSnapshot => ({
            quadrantId: quadrant.id,
            sessions: sessionSnapshot.docs.map(doc => {
              allSessionsCount += 1;
              return {
                id: doc.id,
                ...doc.data(),
                ...userSessions[doc.id],
              };
            }),
          }));
      });

      const quadrantSessions = await Promise.all(quadrantSessionsPromises);
      const quadrantDetailsWithSessions = quadrants.map((quadrant, i) => {
        const isFirstQuadrant = i === 0;
        const isPremium: boolean =
          categoryStore.isFirstLevel(levelId) && isFirstQuadrant
            ? false
            : !hasUserSubscription;

        const sessions =
          quadrantSessions.find(q => q.quadrantId === quadrant.id)?.sessions ||
          [];
        const sortedSessions = this.sortSessions(sessions as SessionType[]);

        return {
          ...quadrant,
          isPremium,
          sessions: sortedSessions,
        };
      });

      this.setQuadrants(quadrantDetailsWithSessions as QuadrantType[]);
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

      // const isLastCategory = categoryStore.getIsLastCategoryByKey(
      //   category.name,
      // );

      const sessions = this.sessions;
      const currentSession = this.session;
      if (!currentSession) {
        return;
      }

      // if (isLastCategory) {
      //   sessions = this.allSessionsFromAllCategories;
      // }

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
    // const promise1 = userCategoryStore.updateUserCategory({
    //   id: categoryId,
    //   field: `sessions.${currentSession.id}.isAllQuestionsSwiped`,
    //   data: true,
    // });


    const promise1 = userCategoryStore.updateSession({
      sessionId: currentSession.id,
      field: 'isAllQuestionsSwiped',
      data: true,
    });

    // const promise2 = userCategoryStore.updateUserCategory({
    //   id: categoryId,
    //   field: `sessions.${nextSession.id}.isBlocked`,
    //   data: false,
    // });

    const promise2 = userCategoryStore.updateSession({
      sessionId: nextSession.id,
      field: 'isBlocked',
      data: false,
    });

    // const promise3 = userCategoryStore.updateUserCategory({
    //   id: categoryId,
    //   field: 'currentSession',
    //   data: nextSession.id,
    // });

    const promise3 = userCategoryStore.updateLevel({
      levelId: categoryId,
      field: 'currentSession',
      data: nextSession.id,
    });

    // const promise4 = userCategoryStore.updateUserCategory({
    //   id: categoryId,
    //   field: 'currentSessionNumber',
    //   data: nextSession.sessionNumber,
    // });

    const promise4 = userCategoryStore.updateLevel({
      levelId: categoryId,
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

  levelSwipeHandler = async (levelId: string) => {
    try {
      this.setIsFetching(true);

      await this.fetchQuadrants(levelId);
      await this.fetchSessions(levelId);
    } catch (e) {
      errorHandler({error: e});
    } finally {
      this.setIsFetching(false);
    }
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

      // await userCategoryStore.updateUserCategory({
      //   id: category.id,
      //   field: 'ratePopUpBreakpoint',
      //   data: nextRatePopupSession,
      // });

      await userCategoryStore.updateLevel({
        levelId: category.id,
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
