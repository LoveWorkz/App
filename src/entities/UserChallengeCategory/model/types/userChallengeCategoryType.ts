import {CategoryKey} from '@src/entities/Category';

export interface UserChallengeCategoryType {
  userId: string;
  challengeCategory: Record<
    CategoryKey,
    {
      isBlocked: boolean;
      selectedChallengesIds: string[];
      isAllChallengesSelected: boolean;
      selectedSpecialChallengesIds: Record<string, UserSpecialChallenge>;
    }
  >;
}

export interface UserSpecialChallenge {
  isBlocked: boolean;
  isSelected: boolean;
}
