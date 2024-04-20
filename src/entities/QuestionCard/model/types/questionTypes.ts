import {CategoryType} from '@src/entities/Category';
import {RubricType} from '@src/entities/Rubric';
import {DisplayText} from '@src/shared/types/types';

export type QuestionCardTypes =
  | 'WILD_CARD'
  | 'CHALLENGE_CARD'
  | 'ORDINARY_CARD'
  | 'EMPTY_CARD';

export interface BasicQuestionType {
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

export interface QuestionType extends BasicQuestionType {
  category: CategoryType | null;
  rubric: RubricType | null;
}

export type QuestionsMapType = Record<string, QuestionType>;

export interface EnrichQuestionsParams {
  questions: BasicQuestionType[];
  categoriesMap?: Record<string, CategoryType>;
  rubricsMap?: Record<string, RubricType>;
}
