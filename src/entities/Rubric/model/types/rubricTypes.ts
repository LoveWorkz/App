import {DisplayText} from '@src/shared/types/types';

export interface RubricType {
  breakPointForCheckingDate: number;
  createdDate: string;
  currentQuestion: string;
  description: DisplayText;
  displayName: DisplayText;
  id: string;
  image: string;
  name: string;
  questions: string[];
  questionSwipeStartDate: string;
  startQuestionDate: string;
  swipedQuestionsPercentage: number;
  totalViews: number;
}
