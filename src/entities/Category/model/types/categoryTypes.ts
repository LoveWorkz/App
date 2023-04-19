export enum CateorySize {
  M = 'size_m',
  L = 'size_l',
  XL = 'size_xl',
}

export interface CategoryImageType {
  small: string;
  large: string;
}

export type CategoryName = 'Starter' | 'Basic' | 'Deep' | 'Intimate' | 'Hot';

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
  checkTime: number;
  isAllQuestionsSwiped: boolean;
}
