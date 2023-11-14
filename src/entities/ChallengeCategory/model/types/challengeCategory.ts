import {CategoryKey} from '@src/entities/Category';
import {DisplayText} from '@src/shared/types/types';

export interface ChallengeCategoryType {
  id: string;
  image: string;
  name: CategoryKey;
  isBlocked: boolean;
  isActive: Boolean;
  nomer: number;
  displayName: DisplayText;
}

export interface CurrentChallengeCategoryType {
  currentChallengeCategory: string;
  currentChallengeCategoryId: string;
}
