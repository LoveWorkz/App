import {DisplayText} from '@src/shared/types/types';

export type QuestionCardTypes = 'WILD_CARD' | 'Action_CARD' | 'ORDINARY';

export interface QuestionType {
  categoryId: string;
  question: DisplayText;
  rubricId: string;
  type: QuestionCardTypes;
  id: string;
  createdDate: string;
}

export interface QuestionPreviewType {
  categoryName: string;
  rubricName: string;
  questionNumber: number;
}
