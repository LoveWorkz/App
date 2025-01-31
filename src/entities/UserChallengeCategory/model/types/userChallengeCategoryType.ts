import {CategoryKey} from '@src/entities/Category';
import { ChallengeType, SpecialChallengeType } from '@src/entities/Challenge';
import {FavoriteType} from '@src/entities/Favorite';

export interface UserChallengeCategoryType {
  userId: string;
  coreChallengeFavorites: FavoriteType;
  specialChallengeFavorites: FavoriteType;
  selectedChallengesIds: string[];
  selectedSpecialChallengesIds: string[];
  activeSpecialChallangesIds: Array<SpecialChallengeType | ChallengeType>;
  challengeCategory: Record<
    CategoryKey,
    {
      isBlocked: boolean;
      isAllChallengesSelected: boolean;
    }
  >;
}