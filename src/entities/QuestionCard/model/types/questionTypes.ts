import {DisplayText} from '@src/shared/types/types';

export type QuestionCardTypes =
  | 'WILD_CARD'
  | 'CHALLENGE_CARD'
  | 'ORDINARY_CARD';

export interface QuestionType {
  categoryId: string;
  rubricId: string;
  type: QuestionCardTypes;
  question: DisplayText;
  id: string;
  createdDate: string;
  difficulty: number;
  image?: string;

  challenge?: string;
}

export type QuestionsMapType = Record<string, QuestionType>;
