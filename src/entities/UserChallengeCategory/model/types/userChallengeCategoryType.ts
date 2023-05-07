import {ChallengeCategoriesNames} from '@src/entities/ChallengeCategory';

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
