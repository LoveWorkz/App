export enum CateorySize {
  M = 'size_m',
  L = 'size_l',
  XL = 'size_xl',
}

export interface CategoryImageType {
  small: string;
  large: string;
}

export interface CategoryType {
  name: string;
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
}
