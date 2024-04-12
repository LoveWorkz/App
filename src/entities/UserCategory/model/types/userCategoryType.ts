import {CategoryType} from '@src/entities/Category';

export interface UserCategory {
  levels: Record<string, Partial<CategoryType>>;
  userId: string;
}
