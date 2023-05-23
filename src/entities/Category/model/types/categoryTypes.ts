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

export enum CategoryKey {
  Starter = 'Starter',
  Basic = 'Basic',
  Deep = 'Deep',
  Intimate = 'Intimate',
  Hot = 'Hot',
  All_In_One = 'All_In_One',
}

export interface CategoryType {
  name: CategoryKey;
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
}
