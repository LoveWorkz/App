export type QuestionCardTypes = 'WILD_CARD' | 'Action_CARD' | 'ORDINARY';

export interface Session {
  challenge: string;
  question: string[];
}

export interface QuestionType {
  categoryId: string;
  rubricId: string;
  type: QuestionCardTypes;
  id: string;
  createdDate: string;
  sessions: Session[];
}

export interface QuestionPreviewType {
  categoryName: string;
  rubricName: string;
  questionNumber: number;
  defaultQuestionNumber?: number;
}
