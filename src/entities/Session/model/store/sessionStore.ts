import {makeAutoObservable, runInAction} from 'mobx';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';

import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {Collections} from '@src/shared/types/firebase';
import {QuestionType} from '@src/entities/QuestionCard';
import {userStore} from '@src/entities/User';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {DocumentType} from '@src/shared/types/types';
import {categoryStore, CategoryType} from '@src/entities/Category';
import {userCategoryStore} from '@src/entities/UserCategory';
import {getNextElementById} from '@src/shared/lib/common';
import {inAppReviewStore} from '@src/features/InAppReview';
import {favoriteStore} from '@src/entities/Favorite';
import {eventEndStorage} from '@src/shared/lib/storage/adapters/EventEndAdapter';
import {EVENT_END_TYPE_KEY} from '@src/shared/consts/storage';
import {ChallengeType, SpecialChallengeType} from '@src/entities/Challenge';
import {ChallengeGroupType} from '@src/entities/ChallengeGroup';
import {QuadrantType, SessionsMap, SessionType} from '../types/sessionType';
import {
  EventEndType,
  FIRST_QUADRANT_ID,
  SESSION_INTERVAL_FOR_RATE_PROMPT,
} from '../lib/sessionLib';

class SessionStore {
  quadrants: QuadrantType[] = [];
  sessions: SessionType[] = [];
  session: SessionType | null = null;
  allSessionsFromAllCategories: SessionType[] = [];
  sessionsMap: SessionsMap = {};
  sessionChallenge?: SpecialChallengeType;
  coreChallengeGroup: null | ChallengeGroupType<ChallengeType[]> = null;
  isChallengeSpecial: boolean = true;
  isFetching: boolean = true;

  currentQuadrantsSessions: SessionType[] = [];
  currentQuadrant: QuadrantType | null = null;
  lastQuadrant: QuadrantType | null = null;
  favoriteQuadrantsSessions: QuadrantType[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setIsFetching = (isFetching: boolean) => {
    this.isFetching = isFetching;
  };

  setQuadrants = (quadrants: QuadrantType[]) => {
    this.quadrants = quadrants;
  };

  setFavoriteQuadrantsSessions = (quadrants: QuadrantType[]) => {
    this.favoriteQuadrantsSessions = quadrants;
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
    crashlytics().log('Fetching session challenge');

    const source = await userStore.checkIsUserOfflineAndReturnSource();

    const currentSession = this.session;
    if (!currentSession) {
      return;
    }

    const coreChallengeGroupCollection = firestore().collection(
      Collections.CORE_CHALLENGE_GROUPS,
    );
    const specialChallengeCollection = firestore().collection(
      Collections.SPECIAL_CHALLENGES_2,
    );

    const currentSessionChallengeId = currentSession.challenge;

    try {
      const coreChallengeGroupQuerySnapshot = await coreChallengeGroupCollection
        .where('id', '==', currentSessionChallengeId)
        .get({source});

      if (!coreChallengeGroupQuerySnapshot.empty) {
        const coreChallengeGroup =
          coreChallengeGroupQuerySnapshot.docs[0].data();

        runInAction(() => {
          this.coreChallengeGroup = coreChallengeGroup as ChallengeGroupType<
            ChallengeType[]
          >;
          this.isChallengeSpecial = false;
        });

        return;
      }

      // If an element not found, search in the second collection
      const specialChallengeQuerySnapshot = await specialChallengeCollection
        .where('id', '==', currentSessionChallengeId)
        .get({source});
      if (!specialChallengeQuerySnapshot.empty) {
        const sessionChallenge = specialChallengeQuerySnapshot.docs[0].data();

        runInAction(() => {
          this.sessionChallenge = sessionChallenge as SpecialChallengeType;
          this.isChallengeSpecial = true;
        });
      }
    } catch (error) {
      errorHandler({error});
    }
  };

  getAndSetSession = (sessionId: string) => {
    const session = this.getSession(sessionId);
    this.setSession(session);
  };

  setSelectedQuadrantBySession(sessionId: string) {
    for (const quadrant of this.quadrants) {
      const sessionExists = quadrant.sessions.some(
        session => session.id === sessionId,
      );
      if (sessionExists) {
        this.setCurrentQuadrant(quadrant);
        return;
      }
    }
  }

  setSession = (session: SessionType) => {
    this.session = session;
  };

  selectSessionAndNavigate = ({session}: {session: SessionType}) => {
    const categoryId = categoryStore.category?.id;
    if (!categoryId) {
      return;
    }

    this.setSession(session);
    this.setSelectedQuadrantBySession(session.id);
    this.setEventEndType(session);
    navigation.navigate(AppRouteNames.QUESTIONS, {
      type: DocumentType.CATEGORY,
      id: categoryId,
    });
  };

  setEventEndType = async (session: SessionType) => {
    // setting level end
    if (this.isLastSessionInsideQuadrant(session) && this.isLastQuadrant()) {
      await eventEndStorage.setEventEndType(
        EVENT_END_TYPE_KEY,
        JSON.stringify(EventEndType.LEVEL_END),
      );

      return;
    }

    // setting quadrants end
    if (this.isLastSessionInsideQuadrant(session)) {
      await eventEndStorage.setEventEndType(
        EVENT_END_TYPE_KEY,
        JSON.stringify(EventEndType.QUADRANTS_END),
      );

      return;
    }

    // setting session end
    await eventEndStorage.setEventEndType(
      EVENT_END_TYPE_KEY,
      JSON.stringify(EventEndType.SESSION_END),
    );
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

      const quadrants = data.docs.map((doc, _i) => {
        const quadrant = doc.data() as QuadrantType;

        const isPremium: boolean =
          categoryStore.isFirstLevel(levelId) &&
          this.isFirstQuadrant(quadrant.id)
            ? false
            : !hasUserSubscription;

        if (quadrant.isCurrent) {
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
      const quadrantDetailsWithSessions = quadrants.map((quadrant, _i) => {
        const isPremium: boolean =
          categoryStore.isFirstLevel(levelId) &&
          this.isFirstQuadrant(quadrant.id)
            ? false
            : !hasUserSubscription;

        const sessions =
          quadrantSessions.find(q => q.quadrantId === quadrant.id)?.sessions ||
          [];
        const sortedSessions = this.sortSessions(sessions as SessionType[]);

        if (quadrant.isCurrent) {
          this.setCurrentQuadrantsSessions(sortedSessions);
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

  isFirstQuadrant = (quadrantId: string) => {
    return FIRST_QUADRANT_ID === quadrantId;
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

    const sessionQuestionsIds = session.questions;

    return sessionQuestionsIds.map(questionId => {
      return questionsMap[questionId];
    });
  };

  /**
   * Unlock the next session after finishing the current one.
   * @param category The current category details, including sessions and other metadata.
   */
  async updateUserSessionAfterSwipedAllQuestions({
    category,
    currentCoreChallengeId,
  }: {
    category: CategoryType;
    currentCoreChallengeId?: string;
  }) {
    try {
      crashlytics().log(
        'Unlocking the next session after finishing the current one',
      );

      // Retrieve current session details and verify conditions.
      const sessions = this.currentQuadrantsSessions;
      const currentSession = this.session;
      if (!currentSession) {
        return;
      }

      // Determine the next session.
      const nextSession = getNextElementById<SessionType>({
        id: currentSession.id,
        array: sessions,
      });
      if (!nextSession || !nextSession.isBlocked) {
        console.log('No need to update next session.');
        return;
      }

      await this.updateSessionsData({
        level: category,
        currentSession,
        nextSession,
        currentCoreChallengeId,
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
    currentCoreChallengeId,
  }: {
    level: CategoryType;
    currentSession: SessionType;
    nextSession: SessionType;
    currentCoreChallengeId?: string;
  }) {
    try {
      const updateSessionStatus = userCategoryStore.updateUserSessions([
        {
          sessionId: currentSession.id,
          levelId: level.id,
          updates: {
            isCurrent: false,

            // linking core challenge with a session after selecting it
            ...(currentCoreChallengeId
              ? {linkedCoreChallenge: currentCoreChallengeId}
              : {}),
          },
        },
        {
          sessionId: nextSession.id,
          levelId: level.id,
          updates: {
            isBlocked: false,
            isCurrent: true,
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

      // Update level store and prepare session data for the update.
      categoryStore.setCategory(newLevel);
      categoryStore.updateLevels({
        levelId: level.id,
        field: 'currentSessionNumber',
        value: nextSession.sessionNumber,
      });

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
    } catch (error) {
      errorHandler({error});
    }
  }

  toggleSessionFavorite = async ({
    sessionid,
    isFavorite,
  }: {
    sessionid: string;
    isFavorite: boolean;
  }) => {
    if (isFavorite) {
      await favoriteStore.deleteFromFavorites(sessionid, 'session');
    } else {
      await favoriteStore.addToFavorites(sessionid, 'session');
    }
  };

  fetchQuadrantsAndSessionsForLevel = async (level: CategoryType) => {
    try {
      this.setIsFetching(true);

      await this.fetchQuadrants(level.id);
      await this.fetchSessions(level.id);
      categoryStore.setCategory(level);
    } catch (e) {
      errorHandler({error: e});
    } finally {
      this.setIsFetching(false);
    }
  };

  levelSwipeHandler = async (level: CategoryType) => {
    this.fetchQuadrantsAndSessionsForLevel(level);
  };

  /**
   * Handles the swipe action for levels, specifically updating sessions to mark favorites.
   * @param {CategoryType} level - The level for which to handle swipe actions.
   */
  async levelSwipeHandlerForFavorites(level: CategoryType) {
    try {
      const favoriteIds = favoriteStore.sessiionFavorites?.ids || [];

      // keep order, call this method before filtering quadrants
      await this.fetchQuadrantsAndSessionsForLevel(level);

      // Map through quadrants to filter and flag favorite sessions
      const favoriteQuadrantsSessions = this.quadrants.map(quadrant => {
        // Filter sessions to find those that are marked as favorites
        const favoriteSessions = quadrant.sessions
          .filter(session => favoriteIds.includes(session.id))
          .map(session => ({...session}));

        return {
          ...quadrant,
          sessions: favoriteSessions,
        };
      });

      // Filter out quadrants that have no favorite sessions
      const quadrantsWithFavoriteSessions = favoriteQuadrantsSessions.filter(
        quadrant => quadrant.sessions.length > 0,
      );

      this.setFavoriteQuadrantsSessions(quadrantsWithFavoriteSessions);
    } catch (e) {
      errorHandler({error: e});
    }
  }

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

  isLastSessionInsideQuadrant = (currentSession: SessionType) => {
    const quadrantsList = this.quadrants;

    for (const quadrant of quadrantsList) {
      // Find the last session in the current quadrant
      const lastSession = quadrant.sessions[quadrant.sessions.length - 1];
      // Check if the current session's ID matches the last session's ID in this quadrant
      if (currentSession?.id === lastSession?.id) {
        return true;
      }
    }

    return false;
  };

  // Function to find and update the next quadrant after the current one is completed.
  async findAndUpdateNextQuadrant(
    level: CategoryType,
    currentCoreChallengeId?: string,
  ) {
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

    if (!nextQuadrant || !nextQuadrant.isBlocked) {
      console.log('No need to update next quadrant.');
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
              isCurrent: true,
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
      currentCoreChallengeId,
    });

    // Set the new current quadrant and its sessions in the context.
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
            isCurrent: false,
          },
        },
        {
          sessionId: nextSessionId,
          levelId: nextLevel.id,
          updates: {
            isBlocked: false,
            isCurrent: true,
          },
        },
      ]);
    } catch (error) {
      errorHandler({error});
    }
  };

  getCurrentQuadrant = (): QuadrantType | null => {
    const quadrants = this.quadrants;
    return quadrants.find(quadrant => quadrant.isCurrent) || null;
  };

  getCurrentQuadrantAndSession = (): QuadrantType | null => {
    const currentQuadrant = this.getCurrentQuadrant();
    if (!currentQuadrant) {
      return null;
    }

    const currentSession = currentQuadrant.sessions.filter(
      session => session.isCurrent,
    );
    return {...currentQuadrant, sessions: currentSession};
  };

  /**
   * Updates a specific field in user sessions and local session data.
   * @param {string} sessionId - The current session ID.
   * @param {string} levelId - The ID of the current level or category.
   * @param {string} fieldName - The name of the field to update.
   * @param {any} fieldValue - The new value for the field.
   */
  updateSessionField = async ({
    sessionId,
    levelId,
    fieldName,
    fieldValue,
  }: {
    sessionId: string;
    levelId: string;
    fieldName: string;
    fieldValue: string | number;
  }) => {
    // Update the user sessions with the new field value
    await userCategoryStore.updateUserSessions([
      {
        sessionId: sessionId,
        levelId: levelId,
        updates: {
          [fieldName]: fieldValue,
        },
      },
    ]);

    // Retrieve the current session from the session store
    const currentSession = this.session;

    // If there is a current session, update it with the new field value
    if (currentSession) {
      this.setSession({...currentSession, [fieldName]: fieldValue});
    }
  };

  getQuadrantIndexById = (quadrants: QuadrantType[], id: string) => {
    const quadrantNumber = quadrants.findIndex(quadrant => quadrant.id === id);
    return quadrantNumber === -1 ? 0 : quadrantNumber;
  };

  processSessionCompletion = async (currentCoreChallengeId?: string) => {
    try {
      crashlytics().log('Session Completion handling');

      const level = categoryStore.category;
      const session = this.session;

      // Ensure both level and session are valid.
      if (!level || !session) {
        return;
      }

      userStore.setHasUserCompletedAnySession(true);

      if (this.isLastQuadrant() && this.isLastSessionInsideQuadrant(session)) {
        categoryStore.updateUserLevelAftePassedAllSessionsAndQuadrats({
          level,
        });
      } else if (this.isLastSessionInsideQuadrant(session)) {
        // Find and update to the next quadrant.
        await this.findAndUpdateNextQuadrant(level, currentCoreChallengeId);
      } else {
        // Update user session normally if none of the special conditions apply.
        this.updateUserSessionAfterSwipedAllQuestions({
          category: level,
          currentCoreChallengeId,
        });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };
}

export default new SessionStore();
