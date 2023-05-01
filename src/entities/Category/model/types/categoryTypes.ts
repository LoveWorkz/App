import {DisplayText} from '@src/shared/types/types';

export enum CateorySize {
  M = 'size_m',
  L = 'size_l',
  XL = 'size_xl',
}

export interface CategoryImageType {
  small: string;
  large: string;
  middle: string;
}

export type CategoryName =
  | 'Starter'
  | 'Basic'
  | 'Deep'
  | 'Intimate'
  | 'Hot'
  | 'All In One';

export interface CategoryType {
  name: CategoryName;
  id: string;
  image: CategoryImageType;
  isBlocked: boolean;
  description: string;
  questions: string[];
  categorySize: 'large' | 'small';
  leftSide?: boolean;
  size?: CateorySize;
  isCategoryDetailsVisible: boolean;
  currentQuestion: string;
  swipedQuestionsPercentage: number;
  questionSwipeStartDate: string;
  breakPointForCheckingDate: number;
  isAllQuestionsSwiped: boolean;
  createdDate: string;
  displayName: DisplayText;
}

export interface CurrentCategory {
  currentCategory: string;
  currentCategoryId: string;
}

export interface UserCategory {
  categories: Record<string, Partial<CategoryType>>;
  userId: string;
}
