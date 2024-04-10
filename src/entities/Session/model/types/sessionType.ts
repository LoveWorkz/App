import {CategoryKey} from '@src/entities/Category';

export interface SessionType {
  challenge: {
    isChallengeSpecial: boolean;
    challengeId: string;
  };
  id: string;
  sessionNumber: number;
  questions: string[];
  currentQuestion: string;
  swipedQuestionsPercentage: number;
  questionSwipeStartDate: string;
  breakPointForCheckingDate: number;
  isAllQuestionsSwiped: boolean;
  isBlocked: boolean;
  categoryId: string;
}

export type UserSessionType = Record<string, Partial<SessionType>>;

export type SessionsMap = Record<string, SessionType>;

export type SessionState = 'completed' | 'current' | 'upcoming';

export interface QuadrantType {
  id: string;
  step: string;
  title: string;
  description: string;
  sessions: SessionType[];
}
