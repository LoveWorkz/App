import {CategoryKey} from '@src/entities/Category';
import {
  sessionsCountWithSubscription,
  SessionType,
  userSession,
} from '@src/entities/Session';

const sessionsIdMap: Partial<Record<CategoryKey, string>> = {
  [CategoryKey.Starter]: 'starter_session',
  [CategoryKey.Basic]: 'basic_session',
  [CategoryKey.Deep]: 'deep_session',
  [CategoryKey.Intimate]: 'intimate_session',
  [CategoryKey.Specials]: 'hot_session',
};

export const getUserCategoryInitData = (categoryKey: CategoryKey) => {
  const allInOneCategoryKey = CategoryKey.How_To_Use;
  const isCategoryAllInOne = categoryKey === allInOneCategoryKey;
  const isBlocked = categoryKey !== CategoryKey.Starter && !isCategoryAllInOne;
  const firstSessionId = sessionsIdMap[categoryKey]
    ? `${sessionsIdMap[categoryKey]}_1`
    : '';

  return {
    isBlocked,
    isCategoryDetailsVisible: true,
    isAllSessionsPassed: false,
    currentSession: firstSessionId,
    currentSessionNumber: 1,
    ratePopUpBreakpoint: 3,
    sessions: {
      ...(isCategoryAllInOne
        ? getSessionsForAllInOne()
        : getSessions(categoryKey)),
    },
  };
};

const getSessions = (categoryKey: CategoryKey) => {
  const result: Record<string, Partial<SessionType>> = {};

  for (let i = 1; i <= sessionsCountWithSubscription; i++) {
    const isSessionUnlocked = i === 1;

    result[`${sessionsIdMap[categoryKey]}_${i}`] = {
      ...result[`${sessionsIdMap[categoryKey]}_${i}`],
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
    for (let i = 1; i <= sessionsCountWithSubscription; i++) {
      const isSessionUnlocked = j === 0 && i === 1;

      result[`${sessionId}_${i}`] = {
        ...userSession,
        isBlocked: isSessionUnlocked ? false : true,
      };
    }
  });

  return result;
};
