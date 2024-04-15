import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {Collections} from '@src/shared/types/firebase';
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

  currentQuadrantsSessions: SessionType[] = [];
  currentQuadrant: QuadrantType | null = null;
  lastQuadrant: QuadrantType | null = null;

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

  setCurrentQuadrantsSessions = (sessions: SessionType[]) => {
    this.currentQuadrantsSessions = sessions;
  };

  setLastQuadrant = (lastQuadrant: QuadrantType) => {
    this.lastQuadrant = lastQuadrant;
  };

  setCurrentQuadrant = (currentQuadrant: QuadrantType) => {
    this.currentQuadrant = currentQuadrant;
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

        if (quadrant.isCurrent) {
          this.setCurrentQuadrant(quadrant);
        }

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

        if (quadrant.isCurrent) {
          this.setCurrentQuadrantsSessions(sortedSessions);
          this.setCurrentQuadrant(quadrant);
        }

        return {
          ...quadrant,
          isPremium,
          sessions: sortedSessions,
        };
      });

      const lastQuadrant = quadrants[quadrants.length - 1];

      this.setQuadrants(quadrantDetailsWithSessions as QuadrantType[]);
      this.setLastQuadrant(lastQuadrant);
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

  /**
   * Handles updates after all questions in a session are swiped, prepares for the next session.
   * @param category The current category details, including sessions and other metadata.
   */
  async updateUserSessionAfterSwipedAllQuestions({
    category,
  }: {
    category: CategoryType;
  }) {
    try {
      crashlytics().log(
        'Updating user session after all questions have been swiped',
      );

      // Retrieve current session details and verify conditions.
      const sessions = this.currentQuadrantsSessions;
      const currentSession = this.session;
      if (!currentSession || currentSession.isAllQuestionsSwiped) {
        console.log('No update required or all questions already swiped.');
        return;
      }

      // Determine the next session.
      const nextSession = getNextElementById<SessionType>({
        id: currentSession.id,
        array: sessions,
      });
      if (!nextSession) {
        console.log('No next session found.');
        return;
      }

      // Update category store and prepare session data for the update.
      categoryStore.setCategory({
        ...category,
        currentSession: nextSession.id,
        currentSessionNumber: nextSession.sessionNumber,
      });

      await this.updateSessionsData({
        level: category,
        currentSession,
        nextSession,
      });

      await this.checkSessionsAndShowRatePopup(category);
    } catch (e) {
      errorHandler({error: e});
    }
  }

  /**
   * Updates session and level data in Firestore based on session progression.
   * @param level Current category level details.
   * @param currentSession Current active session details.
   * @param nextSession Next session details.
   */
  async updateSessionsData({
    level,
    currentSession,
    nextSession,
  }: {
    level: CategoryType;
    currentSession: SessionType;
    nextSession: SessionType;
  }) {
    try {
      const updateSessionStatus = userCategoryStore.updateUserSessions([
        {
          sessionId: currentSession.id,
          levelId: level.id,
          updates: {
            isAllQuestionsSwiped: true,
          },
        },
        {
          sessionId: nextSession.id,
          levelId: level.id,
          updates: {
            isBlocked: false,
          },
        },
      ]);

      // Update level details regarding the current and next session.
      const updateLevelDetails = userCategoryStore.updateUserLevels([
        {
          levelId: level.id,
          updates: {
            currentSession: nextSession.id,
            currentSessionNumber: nextSession.sessionNumber,
          },
        },
      ]);

      const newLevel = {
        ...level,
        currentSession: nextSession.id,
        currentSessionNumber: nextSession.sessionNumber,
      };
      categoryStore.setCategory(newLevel);

      // Set a finish date notification for the last session.
      const setFinishDate = userStore.setNotification({
        field: 'lastSessionDate',
        value: new Date(),
      });

      await Promise.all([
        updateSessionStatus,
        updateLevelDetails,
        setFinishDate,
      ]);

      // Optionally, update special challenge if applicable.
      if (
        currentSession.challenge &&
        currentSession.challenge.isChallengeSpecial
      ) {
        await challengeStore.updateSpecialChallenge({
          id: currentSession.challenge.challengeId,
          value: false,
          field: 'isBlocked',
        });
      }
    } catch (error) {
      errorHandler({error});
    }
  }

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

      await userCategoryStore.updateUserLevels([
        {
          levelId: category.id,
          updates: {
            ratePopUpBreakpoint: nextRatePopupSession,
          },
        },
      ]);
    }
  };

  showRatePopup = async (currentSessionNumber: number) => {
    // Check if it's the correct session to prompt the rate popup based on the interval.
    return currentSessionNumber % SESSION_INTERVAL_FOR_RATE_PROMPT === 0;
  };

  isLastQuadrant = () => {
    return this.currentQuadrant?.id === this.lastQuadrant?.id;
  };

  getFirstQuadrant = () => {
    return this.quadrants[0];
  };

  isFirstQuadrant = () => {
    return this.currentQuadrant?.id === this.getFirstQuadrant().id;
  };

  isLastSessionInsideQuadrant = () => {
    const currentSession = this.session;
    const lastSession =
      this.currentQuadrantsSessions[this.currentQuadrantsSessions.length - 1];
    return currentSession?.id === lastSession.id;
  };

  // Function to find and update the next quadrant after the current one is completed.
  async findAndUpdateNextQuadrant(level: CategoryType) {
    if (!userStore.getUserHasSubscription()) {
      console.log('User does not have a valid subscription.');
      return;
    }

    const currentQuadrant = this.currentQuadrant;
    if (!currentQuadrant) {
      console.log('No current quadrant available.');
      return;
    }

    const nextQuadrant = getNextElementById<QuadrantType>({
      id: currentQuadrant.id,
      array: this.quadrants,
    });

    if (!nextQuadrant) {
      console.log('No next quadrant found.');
      return;
    }

    // Update the quadrant state to reflect the transition to the next quadrant.
    const updatedQuadrants = this.quadrants.map(quadrant =>
      quadrant.id === nextQuadrant.id
        ? {
            ...quadrant,
            isBlocked: false,
            isCurrent: true,
            sessions: quadrant.sessions.map((session, index) => ({
              ...session,
              isBlocked: index === 0 ? false : session.isBlocked,
            })),
          }
        : {
            ...quadrant,
            isCurrent: false,
          },
    );

    this.setQuadrants(updatedQuadrants);

    // Update quadrant statuses in the store.
    await userCategoryStore.updateUserQuadrants([
      {
        levelId: level.id,
        quadrantId: currentQuadrant.id,
        updates: {isCurrent: false},
      },
      {
        levelId: level.id,
        quadrantId: nextQuadrant.id,
        updates: {isCurrent: true, isBlocked: false},
      },
    ]);

    // Update session details in the context to reflect the change in quadrants.
    const currentSessions = this.currentQuadrantsSessions;
    const newSession = nextQuadrant.sessions[0];

    await this.updateSessionsData({
      currentSession: currentSessions[currentSessions.length - 1],
      nextSession: newSession,
      level,
    });

    // Set the new current quadrant and its sessions in the context.
    this.setCurrentQuadrant(nextQuadrant);
    this.setCurrentQuadrantsSessions(nextQuadrant.sessions);
  }

  findAndUpdateNextLevelQuadrant = async ({
    levelId,
    nextLevelId,
  }: {
    levelId: string;
    nextLevelId: string;
  }) => {
    const nextQuadrant = this.getFirstQuadrant();
    const currentQuadrant = this.currentQuadrant;
    if (!(nextQuadrant && currentQuadrant)) {
      return;
    }

    this.setCurrentQuadrant(nextQuadrant);

    await userCategoryStore.updateUserQuadrants([
      {
        levelId,
        quadrantId: currentQuadrant.id,
        updates: {
          isCurrent: false,
        },
      },
      {
        levelId: nextLevelId,
        quadrantId: nextQuadrant.id,
        updates: {
          isCurrent: true,
          isBlocked: false,
        },
      },
    ]);
  };

  findAndUpdateFirstSessionInTheNextCategory = async ({
    level,
    nextLevel,
  }: {
    level: CategoryType;
    nextLevel: CategoryType;
  }) => {
    try {
      const userid = userStore.userId;

      // Assume we're ordering by a 'createdAt' field to find the "first" document
      const querySnapshot = await firestore()
        .collection(Collections.USER_LEVELS)
        .doc(userid)
        .collection(Collections.LEVELS)
        .doc(nextLevel.id)
        .collection(Collections.SESSIONS)
        .orderBy('createdAt')
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        console.log('No documents found.');
        return;
      }

      // Get the first document from the results
      const firstDoc = querySnapshot.docs[0];

      const currentSessions = this.currentQuadrantsSessions;
      const currentSession = currentSessions[currentSessions.length - 1];
      const nextSessionId = firstDoc.id;

      await userCategoryStore.updateUserSessions([
        {
          sessionId: currentSession.id,
          levelId: level.id,
          updates: {
            isAllQuestionsSwiped: true,
          },
        },
        {
          sessionId: nextSessionId,
          levelId: nextLevel.id,
          updates: {
            isBlocked: false,
          },
        },
      ]);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };
}

export default new SessionStore();
