import {DisplayText} from '@src/shared/types/types';

export enum ChallengeCategoryKeys {
  Bronze = 'Bronze',
  Silver = 'Silver',
  Gold = 'Gold',
  Diamond = 'Diamond',
  Platinum = 'Platinum',
}

export interface ChallengeCategoryType {
  id: string;
  image: string;
  name: ChallengeCategoryKeys;
  isBlocked: boolean;
  isActive: Boolean;
  nomer: number;
  displayName: DisplayText;
}

export interface CurrentChallengeCategoryType {
  currentChallengeCategory: string;
  currentChallengeCategoryId: string;
}
