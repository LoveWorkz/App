import {QuestionType} from '@src/entities/QuestionCard';

export interface QuestionsPageInfo {
  questionsCount: number;
  categoryName: string;
  rubricName: string;
  swipedQuestionsCount: number;
  currentQuestion: QuestionType;
}
