export type QuestionCardTypes = 'WILD_CARD' | 'Action_CARD' | 'ORDINARY';

export interface QuestionType {
  categoryId: string;
  question: string;
  rubricId: string;
  type: QuestionCardTypes;
  id: string;
}
