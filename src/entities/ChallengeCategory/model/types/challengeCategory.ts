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

export interface UserChallengeCategoryType {
  userId: string;
  challengeCategory: Record<
    ChallengeCategoriesNames,
    {
      isBlocked: boolean;
      selectedChallengesIds: string[];
      isAllChallengesSelected: boolean;
    }
  >;
}

export interface CurrentChallengeCategoryType {
  currentChallengeCategory: string;
  currentChallengeCategoryId: string;
}
