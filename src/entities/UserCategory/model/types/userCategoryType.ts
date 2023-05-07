import {CategoryType} from '@src/entities/Category';

export interface UserCategory {
  categories: Record<string, Partial<CategoryType>>;
  userId: string;
}
