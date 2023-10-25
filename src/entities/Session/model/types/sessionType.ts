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
}

export type UserSessionType = Record<string, Partial<SessionType>>;
