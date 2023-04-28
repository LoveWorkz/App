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
  displayName: RubricLanguageType;
}

export interface RubricLanguageType {
  en: string;
  pt: string;
  de: string;
}

export interface UserRubric {
  rubrics: Record<string, Partial<RubricType>>;
  userId: string;
}
