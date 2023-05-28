import {ChallengeCategoryKeys} from '@src/entities/ChallengeCategory';

export interface UserChallengeCategoryType {
  userId: string;
  challengeCategory: Record<
    ChallengeCategoryKeys,
    {
      isBlocked: boolean;
      selectedChallengesIds: string[];
      isAllChallengesSelected: boolean;
    }
  >;
}
