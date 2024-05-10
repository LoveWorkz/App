import {DisplayText} from '@src/shared/types/types';

export interface SessionType {
  challenge: string;
  id: string;
  sessionNumber: number;
  questions: string[];
  currentQuestion: string;
  swipedQuestionsPercentage: number;
  questionSwipeStartDate: string;
  breakPointForCheckingDate: number;
  isBlocked: boolean;
  categoryId: string;
  displayName: DisplayText;
  description: DisplayText;
  levelId: string;
  quadrantId: string;
  createdAt: string;
  isCurrent: boolean;
}

export type UserSessionType = Record<string, Partial<SessionType>>;
export type UserQuadrantType = Record<string, Partial<QuadrantType>>;

export type SessionsMap = Record<string, SessionType>;

export type SessionState = 'completed' | 'current' | 'upcoming';

export interface QuadrantType {
  id: string;
  step: DisplayText;
  displayName: DisplayText;
  description: DisplayText;
  largeDescription: DisplayText;
  sessions: SessionType[];
  isBlocked: boolean;
  isPremium: boolean;
  isCurrent: boolean;
}
