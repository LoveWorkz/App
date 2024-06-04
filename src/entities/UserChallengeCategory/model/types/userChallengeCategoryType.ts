import {CategoryKey} from '@src/entities/Category';
import {FavoriteType} from '@src/entities/Favorite';

export interface UserChallengeCategoryType {
  userId: string;
  coreChallengeFavorites: FavoriteType;
  specialChallengeFavorites: FavoriteType;
  selectedChallengesIds: string[];
  selectedSpecialChallengesIds: string[];
  challengeCategory: Record<
    CategoryKey,
    {
      isBlocked: boolean;
      isAllChallengesSelected: boolean;
    }
  >;
}
