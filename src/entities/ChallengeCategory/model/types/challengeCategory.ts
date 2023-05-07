import {DisplayText} from '@src/shared/types/types';

export type ChallengeCategoriesNames =
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Diamond'
  | 'Platinum';

export interface ChallengeCategoryType {
  id: string;
  image: string;
  name: ChallengeCategoriesNames;
  isBlocked: boolean;
  isActive: Boolean;
  nomer: number;
  displayName: DisplayText;
}

export interface CurrentChallengeCategoryType {
  currentChallengeCategory: string;
  currentChallengeCategoryId: string;
}
