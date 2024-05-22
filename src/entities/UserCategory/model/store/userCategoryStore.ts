import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {Collections, FirestoreUpdateObject} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {CategoryType} from '@src/entities/Category';
import {SessionType, UserSessionType} from '@src/entities/Session';
import {favoriteStore, FavoriteType} from '@src/entities/Favorite';
import {getLevels, getSessions} from '../lib/userCategory';

class UserCategoryStore {
  userLevels: null | Record<string, CategoryType> = null;
  userLevel: null | CategoryType = null;
  userSessions: null | UserSessionType = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchUserLevels = async (userId: string) => {
    try {
      crashlytics().log('Fetching User Levels.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const userDocRef = firestore()
        .collection(Collections.USER_LEVELS)
        .doc(userId);
      const levelsRef = userDocRef.collection(Collections.LEVELS);

      // Execute parallel requests to fetch user general data and specific levels
      const [userDocSnapshot, levelsQuerySnapshot] = await Promise.all([
        userDocRef.get({source}),
        levelsRef.get({source}),
      ]);

      const userLevelInfo = userDocSnapshot.data();

      const levels = levelsQuerySnapshot.docs.map(doc => ({
        ...(doc.data() as CategoryType),
        id: doc.id,
      }));

      // Build the user levels map
      const userLevelsMap: Record<string, CategoryType> = {};
      levels.forEach(level => (userLevelsMap[level.id] = level));

      runInAction(() => {
        this.userLevels = userLevelsMap;
        favoriteStore.setFavorites({
          favorites: userLevelInfo?.favorites || [],
          favoriteKey: 'session',
        });
      });
    } catch (error) {
      errorHandler({error, message: 'Error fetching user levels'});
    }
  };

  fetchUserLevel = async (userId: string, levelId: string) => {
    const source = await userStore.checkIsUserOfflineAndReturnSource();

    const levelRef = firestore()
      .collection(Collections.USER_LEVELS)
      .doc(userId)
      .collection(Collections.LEVELS)
      .doc(levelId);

    try {
      crashlytics().log('Fetching User Specific Level.');

      const docSnapshot = await levelRef.get({source});

      if (docSnapshot.exists) {
        const levelData = docSnapshot.data() as CategoryType;

        runInAction(() => {
          this.userLevel = levelData;
        });
      } else {
        console.log(`Level document with ID ${levelId} does not exist.`);
      }
    } catch (e) {
      errorHandler({error: e, message: 'Error fetching level:'});
    }
  };

  fetchUserSessions = async (userId: string, levelId: string) => {
    const source = await userStore.checkIsUserOfflineAndReturnSource();

    const sessionsRef = firestore()
      .collection(Collections.USER_LEVELS)
      .doc(userId)
      .collection(Collections.LEVELS)
      .doc(levelId)
      .collection(Collections.SESSIONS);

    try {
      crashlytics().log('Fetching User Sessions.');

      const querySnapshot = await sessionsRef.get({source});

      // Iterate over each level document
      const sessions = querySnapshot.docs.map(doc => {
        const sessionData = doc.data() as SessionType;
        const sessionId = doc.id;

        return {
          ...sessionData,
          id: sessionId,
        };
      });

      const userSessionsMap: Record<string, SessionType> = {};

      sessions.forEach(session => {
        userSessionsMap[session.id] = {
          ...userSessionsMap[session.id],
          ...session,
        };
      });

      runInAction(() => {
        this.userSessions = userSessionsMap;
      });
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  setUserLevels = async (userId: string) => {
    try {
      crashlytics().log('Setting User Levels Data.');

      await firestore()
        .collection(Collections.USER_LEVELS)
        .doc(userId)
        .set({favorites: {ids: []}});

      await this.setLevels(userId);
      await this.setSessions(userId);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setLevels = async (userId: string) => {
    crashlytics().log('Setting User Level.');

    const levels = getLevels();
    const levelIds = Object.keys(levels);

    const userLevelsRef = firestore()
      .collection(Collections.USER_LEVELS)
      .doc(userId)
      .collection(Collections.LEVELS);

    // Assuming 'levels' is an object where keys are level IDs and values are level data
    try {
      const batch = firestore().batch();

      levelIds.forEach(levelId => {
        const singleLevelRef = userLevelsRef.doc(levelId);
        batch.set(singleLevelRef, levels[levelId]);
      });

      await batch.commit();
    } catch (e) {
      errorHandler({error: e, message: 'Error setting levels:'});
    }
  };

  setSessions = async (userId: string) => {
    crashlytics().log('Setting User Sessions.');

    const levelIds = Object.keys(getLevels());
    const batch = firestore().batch();

    levelIds.forEach((levelId, i) => {
      const userSessionsRef = firestore()
        .collection(Collections.USER_LEVELS)
        .doc(userId)
        .collection(Collections.LEVELS)
        .doc(levelId)
        .collection(Collections.SESSIONS);

      const sessions = getSessions(levelId, i);
      const sessionIds = Object.keys(sessions);

      sessionIds.forEach(sessionId => {
        const singleSessionRef = userSessionsRef.doc(sessionId);
        batch.set(singleSessionRef, sessions[sessionId]);
      });
    });

    try {
      await batch.commit();
    } catch (e) {
      errorHandler({error: e, message: 'Error setting sessions:'});
    }
  };

  updateUserLevelFavorites = async ({
    data,
  }: {
    data: string | string[] | FavoriteType;
  }) => {
    try {
      crashlytics().log('Updating User level Favorites.');

      const isOffline = await userStore.getIsUserOffline();
      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      if (isOffline) {
        firestore()
          .collection(Collections.USER_LEVELS)
          .doc(userId)
          .update({
            ['favorites.ids']: data,
          });
      } else {
        await firestore()
          .collection(Collections.USER_LEVELS)
          .doc(userId)
          .update({
            ['favorites.ids']: data,
          });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  deleteSessionFromFavorites = async ({
    sessionId,
    favoriteIds,
  }: {
    sessionId: string;
    favoriteIds: string[];
  }) => {
    try {
      crashlytics().log('Delete User level Favorites.');

      const ids = favoriteIds;
      const newIds = ids.filter(id => {
        return id !== sessionId;
      });

      const favorites: FavoriteType = {
        ids: newIds,
      };

      await this.updateUserLevelFavorites({
        data: newIds,
      });

      return {
        isFavorite: false,
        favorites,
      };
    } catch (e) {
      errorHandler({error: e});
      return null;
    }
  };

  updateUserLevels = async (
    updatesArray: {
      levelId: string;
      updates: Record<string, number | string | boolean>;
    }[],
  ) => {
    crashlytics().log('Update User levels.');

    const db = firestore();
    const batch = db.batch();

    const isOffline = await userStore.getIsUserOffline();
    const userId = userStore.userId;

    if (!userId) {
      console.error('User ID not found.');
      return;
    }

    updatesArray.forEach(update => {
      const {levelId, updates} = update;
      const levelRef = db
        .collection(Collections.USER_LEVELS)
        .doc(userId)
        .collection(Collections.LEVELS)
        .doc(levelId);

      // Prepare update data for each level
      const updateData = Object.entries(updates).reduce(
        (acc: FirestoreUpdateObject, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {},
      );

      // Add update operation to batch
      batch.update(levelRef, updateData);
    });

    // Commit the batch to perform all updates atomically
    try {
      // Perform the update operation based on connectivity
      if (isOffline) {
        batch.commit();
      } else {
        await batch.commit();
      }
      console.log('All level updates processed successfully.');
    } catch (error) {
      errorHandler({error: error, message: 'Error updating multiple levels:'});
    }
  };

  updateUserQuadrants = async (
    updates: {
      levelId: string;
      quadrantId: string;
      updates: Record<string, any>;
    }[],
  ) => {
    crashlytics().log('Update User Quadrants.');

    const db = firestore();
    const batch = db.batch();

    const isOffline = await userStore.getIsUserOffline();
    const userId = userStore.userId;
    if (!userId) {
      return;
    }

    updates.forEach(({levelId, quadrantId, updates}) => {
      const levelRef = db
        .collection(Collections.USER_LEVELS)
        .doc(userId)
        .collection(Collections.LEVELS)
        .doc(levelId);
      const updatePath = `quadrants.${quadrantId}`;

      const formattedUpdates = Object.keys(updates).reduce(
        (acc: FirestoreUpdateObject, key) => {
          acc[`${updatePath}.${key}`] = updates[key]; // create nested paths for update
          return acc;
        },
        {},
      );

      // Add each update to the batch
      batch.update(levelRef, formattedUpdates);
    });

    // Commit the batch to perform all updates atomically
    try {
      // Perform the update operation based on connectivity
      if (isOffline) {
        batch.commit();
      } else {
        await batch.commit();
      }
    } catch (error) {
      errorHandler({error: error, message: 'Error updating quadrants:'});
    }
  };

  updateUserSessions = async (
    updatesArray: {
      sessionId: string;
      levelId: string;
      updates: Record<string, number | string | boolean>;
    }[],
  ) => {
    crashlytics().log('Updating User Sessions.');

    const isOffline = await userStore.getIsUserOffline();
    const userId = userStore.userId;
    if (!userId) {
      return;
    }

    const db = firestore();
    const batch = db.batch();

    updatesArray.forEach(update => {
      const {sessionId, levelId, updates} = update;
      const sessionRef = db
        .collection(Collections.USER_LEVELS)
        .doc(userId)
        .collection(Collections.LEVELS)
        .doc(levelId)
        .collection(Collections.SESSIONS)
        .doc(sessionId);

      // Add each update to the batch
      batch.update(sessionRef, updates);
    });

    // Commit the batch to perform all updates atomically
    try {
      // Perform the update operation based on connectivity
      if (isOffline) {
        batch.commit();
      } else {
        await batch.commit();
      }
    } catch (error) {
      errorHandler({error: error, message: 'Error updating sessions:'});
    }
  };

  deleteUserCategory = async (userId: string) => {
    try {
      crashlytics().log('Deleting User Category.');

      await firestore()
        .collection(Collections.USER_LEVELS)
        .doc(userId)
        .delete();
    } catch (e) {
      errorHandler({error: e, message: 'Error deleting user levels:'});
    }
  };
}

export default new UserCategoryStore();
