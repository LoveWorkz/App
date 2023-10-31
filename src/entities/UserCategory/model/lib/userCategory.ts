import {sessionsCount, SessionType, userSession} from '@src/entities/Session';

const sessionsIdMap: Record<string, string> = {
  category_1: 'starter_session',
  category_2: 'basic_session',
  category_3: 'deep_session',
  category_4: 'intimate_session',
  category_5: 'hot_session',
};

export const getUserCategoryInitData = (categoryId: string) => {
  const allInOneCategoryId = 'category_6';
  const isCategoryAllInOne = categoryId === allInOneCategoryId;
  const isBlocked = categoryId !== 'category_1' && !isCategoryAllInOne;
  const firstSessionId = sessionsIdMap[categoryId]
    ? `${sessionsIdMap[categoryId]}_1`
    : '';

  return {
    isBlocked,
    isCategoryDetailsVisible: true,
    isAllSessionsPassed: false,
    currentSession: firstSessionId,
    sessions: {
      ...(isCategoryAllInOne
        ? getSessionsForAllInOne()
        : getSessions(categoryId)),
    },
  };
};

const getSessions = (categoryId: string) => {
  const result: Record<string, Partial<SessionType>> = {};

  for (let i = 1; i <= sessionsCount; i++) {
    const isSessionUnlocked = i === 1;

    result[`${sessionsIdMap[categoryId]}_${i}`] = {
      ...result[`${sessionsIdMap[categoryId]}_${i}`],
      ...userSession,
      isBlocked: isSessionUnlocked ? false : true,
    };
  }

  return result;
};

const getSessionsForAllInOne = () => {
  let result: Record<string, Partial<SessionType>> = {};

  const sessionsId = Object.values(sessionsIdMap);

  sessionsId.forEach((sessionId, j) => {
    for (let i = 1; i <= sessionsCount; i++) {
      const isSessionUnlocked = j === 0 && i === 1;

      result[`${sessionId}_${i}`] = {
        ...userSession,
        isBlocked: isSessionUnlocked ? false : true,
      };
    }
  });

  return result;
};
