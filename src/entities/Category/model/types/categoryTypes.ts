import {UserQuadrantType, UserSessionType} from '@src/entities/Session';
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
  How_To_Use = 'How_To_Use',
  All_In_One = 'All_In_One',
}

export type CategoryDescriptionType = {
  type: 'paragraph' | 'list';
  content: string | string[];
};

export interface CategoryType {
  name: CategoryKey;
  id: string;
  image: CategoryImageType;
  isBlocked: boolean;
  description: Record<'en' | 'de' | 'pt', CategoryDescriptionType[]>;
  categorySize: 'large' | 'small';
  leftSide?: boolean;
  size?: CateorySize;
  createdDate: string;
  displayName: DisplayText;
  sessions: UserSessionType;
  currentSession: string;
  ratePopUpBreakpoint: number;
  currentSessionNumber: number;
  challengeCategoryId: string;
  quadrants: UserQuadrantType;
  allSessionsCount: number;
}

export interface CurrentCategory {
  currentCategory: string;
}
