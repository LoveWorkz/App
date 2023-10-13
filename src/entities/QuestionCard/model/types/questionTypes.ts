import {DisplayText} from '@src/shared/types/types';

export type QuestionCardTypes =
  | 'WILD_CARD'
  | 'Action_CARD'
  | 'ORDINARY'
  | 'CHALLANGE_CARD';

export interface QuestionType {
  categoryId: string;
  rubricId: string;
  type: QuestionCardTypes;
  question: DisplayText;
  id: string;
  createdDate: string;
  difficulty: number;
  image?: string;

  challengeId?: string;
}

export interface QuestionPreviewType {
  categoryName: string;
  rubricName: string;
  questionNumber: number;
  defaultQuestionNumber?: number;
}
