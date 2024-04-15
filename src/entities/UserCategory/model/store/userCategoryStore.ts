import {makeAutoObservable, runInAction} from 'mobx';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

import {Collections, FirestoreUpdateObject} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {CategoryType} from '@src/entities/Category';
import {
  getLevels,
  getSessions2,
  getUserCategoryInitData,
} from '../lib/userCategory';
import {UserCategory} from '../types/userCategoryType';
import {SessionType, UserSessionType} from '@src/entities/Session';

class UserCategoryStore {
  userCategory: null | UserCategory = null;
  userLevls: null | Record<string, CategoryType> = null;
  userLevel: null | CategoryType = null;
  userSessions: null | UserSessionType = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchUserCategories = async (userId: string) => {
    try {
      crashlytics().log('Fetching User Category.');

      const source = await userStore.checkIsUserOfflineAndReturnSource();

      const userId = userStore.userId;
      if (!userId) {
        return;
      }

      const data = await firestore()
        .collection(Collections.USER_LEVELS)
        .doc(userId)
        .get({source});

      runInAction(() => {
        this.userCategory = data.data() as UserCategory;
      });
    } catch (e) {
      errorHandler({error: e});
    }
  };

  fetchUserLevels = async (userId: string) => {
    const levelsRef = firestore()
      .collection(Collections.USER_LEVELS)
      .doc(userId)
      .collection(Collections.LEVELS);

    try {
      // Get all the level documents for the user
      const querySnapshot = await levelsRef.get();
      // Iterate over each level document
      const levels = querySnapshot.docs.map(doc => {
        const levelData = doc.data() as CategoryType;
        const levelId = doc.id;

        return {
          ...levelData,
          id: levelId,
        };
      });

      const userLevelsMap: Record<string, CategoryType> = {};

      levels.forEach(level => {
        userLevelsMap[level.id] = {
          ...userLevelsMap,
          ...level,
        };
      });

      runInAction(() => {
        this.userLevls = userLevelsMap;
      });
    } catch (e) {
      errorHandler({error: e, message: 'Error fetching levels:'});
    }
  };

  fetchUserLevel = async (userId: string, levelId: string) => {
    const levelRef = firestore()
      .collection(Collections.USER_LEVELS)
      .doc(userId)
      .collection(Collections.LEVELS)
      .doc(levelId);

    try {
      const docSnapshot = await levelRef.get();

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
    const sessionsRef = firestore()
      .collection(Collections.USER_LEVELS)
      .doc(userId)
      .collection(Collections.LEVELS)
      .doc(levelId)
      .collection(Collections.SESSIONS);

    try {
      const querySnapshot = await sessionsRef.get();

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
      crashlytics().log('Setting User Category.');

      const defaultCategories = await categoriesStore.fetchDefaultCategories();
      if (!defaultCategories) {
        return;
      }

      const userCategories: Record<string, Partial<CategoryType>> = {};

      defaultCategories.forEach(category => {
        const categoryId = category.id;

        userCategories[categoryId] = {
          ...getUserCategoryInitData(category.name),
        };
      });

      await firestore()
        .collection(Collections.USER_LEVELS)
        .doc(userId)
        .set({categories: userCategories});

      await this.setLevels(userId);
      await this.setSessions(userId);
    } catch (e) {
      errorHandler({error: e});
    }
  };

  setLevels = async (userId: string) => {
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
    const levelIds = Object.keys(getLevels());
    const batch = firestore().batch();

    levelIds.forEach((levelId, i) => {
      const userSessionsRef = firestore()
        .collection(Collections.USER_LEVELS)
        .doc(userId)
        .collection(Collections.LEVELS)
        .doc(levelId)
        .collection(Collections.SESSIONS);

      const sessions = getSessions2(levelId, i);
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

  updateUserCategory = async ({
    field,
    id,
    data,
  }: {
    id: string;
    field: string;
    data: number | string | boolean;
  }) => {
    try {
      crashlytics().log('Updating User Category.');

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
            [`categories.${id}.${field}`]: data,
          });
      } else {
        await firestore()
          .collection(Collections.USER_LEVELS)
          .doc(userId)
          .update({
            [`categories.${id}.${field}`]: data,
          });
      }
    } catch (e) {
      errorHandler({error: e});
    }
  };

  updateUserLevels = async (
    updatesArray: {
      levelId: string;
      updates: Record<string, number | string | boolean>;
    }[],
  ) => {
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
