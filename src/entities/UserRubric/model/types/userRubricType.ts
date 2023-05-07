import {RubricType} from '@src/entities/Rubric';

export interface UserRubric {
  rubrics: Record<string, Partial<RubricType>>;
  userId: string;
}
