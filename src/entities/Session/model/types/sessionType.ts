import {CategoryKey} from '@src/entities/Category';

export interface SessionType {
  // change to challenge
  challange: string;
  id: string;
  sessionNumber: number;
  questions: string[];
  currentQuestion: string;
  swipedQuestionsPercentage: number;
  questionSwipeStartDate: string;
  breakPointForCheckingDate: number;
  isAllQuestionsSwiped: boolean;
  isBlocked: boolean;
  isMarked: boolean;
  categoryId: string;
}

export type UserSessionType = Record<string, Partial<SessionType>>;

export interface AllSessionsType {
  categoryId: string;
  categoryName: CategoryKey;
  sessions: SessionType[];
  categoryDisplayName: string;
}

export type MarkedSessionsMapType = Record<string, boolean>;

export type SessionsMap = Record<string, SessionType>;
