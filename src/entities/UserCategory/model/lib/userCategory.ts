import {CategoryKey, CategoryType} from '@src/entities/Category';
import {
  sessionsCountWithSubscription,
  SessionType,
  userSession,
} from '@src/entities/Session';
import {QuadrantType} from '@src/entities/Session/model/types/sessionType';

const categoryIdsdMap: Partial<Record<CategoryKey, string>> = {
  [CategoryKey.Starter]: 'level_1',
  [CategoryKey.Basic]: 'level_2',
  [CategoryKey.Deep]: 'level_3',
  [CategoryKey.Intimate]: 'level_4',
  [CategoryKey.Specials]: 'level_5',
};

categoryIdsdMap[CategoryKey.Starter];

const sessionsIdMap: Partial<Record<string, string>> = {
  ['level_1']: 'starter_session',
  ['level_2']: 'basic_session',
  ['level_3']: 'deep_session',
  ['level_4']: 'intimate_session',
  ['level_5']: 'hot_session',
};

const sessionsIdMap2: Partial<Record<CategoryKey, string>> = {
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
  const firstSessionId = sessionsIdMap2[categoryKey]
    ? `${sessionsIdMap2[categoryKey]}_1`
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

    result[`${sessionsIdMap2[categoryKey]}_${i}`] = {
      ...result[`${sessionsIdMap2[categoryKey]}_${i}`],
      ...userSession,
      isBlocked: isSessionUnlocked ? false : true,
    };
  }

  return result;
};

const getSessionsForAllInOne = () => {
  let result: Record<string, Partial<SessionType>> = {};

  const sessionsId = Object.values(sessionsIdMap2);

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

export const levelIds = ['level_1', 'level_2', 'level_3', 'level_4'] as const;
const quadrantIds = [
  'quadrant1',
  'quadrant2',
  'quadrant3',
  'quadrant4',
] as const;

export const getLevels = () => {
  let result: Record<string, Partial<CategoryType>> = {};

  levelIds.forEach(levelId => {
    const isBlocked = levelId !== 'level_1';
    const firstSessionId = sessionsIdMap[levelId]
      ? `${sessionsIdMap[levelId]}_1`
      : '';

    result[levelId] = {
      ...result[levelId],
      isBlocked,
      isCategoryDetailsVisible: true,
      isAllSessionsPassed: false,
      currentSession: firstSessionId,
      currentSessionNumber: 1,
      ratePopUpBreakpoint: 3,
      quadrants: getQuadrants(levelId),
    };
  });

  return result;
};

const getQuadrants = (levelId: string) => {
  let result: Record<string, Partial<QuadrantType>> = {};

  quadrantIds.forEach(quadrantId => {
    const isBlocked = !(levelId === 'level_1' && quadrantId === 'quadrant1');

    result[quadrantId] = {
      ...result[quadrantId],
      isBlocked,
      isCurrent: !isBlocked,
    };
  });

  return result;
};

export const getSessions2 = (levelId: string, j: number) => {
  let result: Record<string, Partial<SessionType>> = {};

  let quadrantIndex = 0;
  const initialTime = new Date(); // Capture the start time

  for (let i = 1; i <= 20; i++) {
    const isSessionUnlocked = j === 0 && i === 1;

    // Add the quadrant ID every 5 sessions, and rotate through the list of quadrants
    let quadrantId = quadrantIds[quadrantIndex];
    if (i % 5 === 0) {
      quadrantIndex = (quadrantIndex + 1) % quadrantIds.length;
    }

    const sessionIdPrefix = sessionsIdMap[levelId];

    // Calculate the createdAt date for this session
    let createdAt = new Date(initialTime.getTime() + i * 60000); // Increase by 1 minute for each session

    result[`${sessionIdPrefix}_${i}`] = {
      ...result[`${sessionIdPrefix}_${i}`],
      ...userSession,
      isBlocked: !isSessionUnlocked,
      levelId: levelId, // Append the level ID
      quadrantId: quadrantId, // Append the quadrant ID every 5 sessions
      createdAt: createdAt.toISOString(), // Store createdAt as an ISO string
      isCurrent: isSessionUnlocked,
    };
  }

  return result;
};
