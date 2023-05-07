import {DisplayText} from '@src/shared/types/types';

export interface RubricType {
  description: DisplayText;
  questions: string;
  name: string;
  startQuestionDate: string;
  id: string;
  currentQuestion: string;
  questionSwipeStartDate: string;
  breakPointForCheckingDate: number;
  swipedQuestionsPercentage: number;
  displayName: DisplayText;
  createdDate: string;
}
