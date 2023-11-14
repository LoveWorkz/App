import {UserSessionType} from '@src/entities/Session';
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
  Specials = 'Specials',
  All_In_One = 'All_In_One',
}

export interface CategoryType {
  name: CategoryKey;
  id: string;
  image: CategoryImageType;
  isBlocked: boolean;
  description: DisplayText;
  categorySize: 'large' | 'small';
  leftSide?: boolean;
  size?: CateorySize;
  isCategoryDetailsVisible: boolean;
  createdDate: string;
  displayName: DisplayText;
  sessions: UserSessionType;
  isAllSessionsPassed: boolean;
  currentSession: string;
  ratePopUpBreakpoint: number;
  currentSessionNumber: number;
  challengeCategoryId: string;
}

export interface CurrentCategory {
  currentCategory: string;
}
