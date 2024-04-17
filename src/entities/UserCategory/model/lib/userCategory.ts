import {CategoryType, FIRST_LEVEL_ID} from '@src/entities/Category';
import {QuadrantType, SessionType, userSession} from '@src/entities/Session';

const sessionsIdMap: Partial<Record<string, string>> = {
  ['level_1']: 'starter_session',
  ['level_2']: 'basic_session',
  ['level_3']: 'deep_session',
  ['level_4']: 'intimate_session',
  ['level_5']: 'hot_session',
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
    const isBlocked = levelId !== FIRST_LEVEL_ID;
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
    const isBlocked = !(
      levelId === FIRST_LEVEL_ID && quadrantId === 'quadrant1'
    );

    result[quadrantId] = {
      ...result[quadrantId],
      isBlocked,
      isCurrent: !isBlocked,
    };
  });

  return result;
};

export const getSessions = (levelId: string, j: number) => {
  let result: Record<string, Partial<SessionType>> = {};

  let quadrantIndex = 0;
  const initialTime = new Date();

  for (let i = 1; i <= 20; i++) {
    const isSessionUnlocked = j === 0 && i === 1;

    // Add the quadrant ID every 5 sessions, and rotate through the list of quadrants
    let quadrantId = quadrantIds[quadrantIndex];
    if (i % 5 === 0) {
      quadrantIndex = (quadrantIndex + 1) % quadrantIds.length;
    }

    const sessionIdPrefix = sessionsIdMap[levelId];

    let createdAt = new Date(initialTime.getTime() + i * 60000); // Increase by 1 minute for each session

    result[`${sessionIdPrefix}_${i}`] = {
      ...result[`${sessionIdPrefix}_${i}`],
      ...userSession,
      isBlocked: !isSessionUnlocked,
      createdAt: createdAt.toISOString(),
      isCurrent: isSessionUnlocked,
      levelId,
      quadrantId,
    };
  }

  return result;
};
