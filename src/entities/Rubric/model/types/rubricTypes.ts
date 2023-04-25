export interface RubricType {
  description: string;
  questions: string;
  name: string;
  startQuestionDate: string;
  id: string;
  currentQuestion: string;
  questionSwipeStartDate: string;
  breakPointForCheckingDate: number;
  swipedQuestionsPercentage: number;
}

export interface UserRubric {
  rubrics: Record<string, Partial<RubricType>>;
  userId: string;
}
