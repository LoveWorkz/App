import {CategoryKey} from '@src/entities/Category';
import {FavoriteType} from '@src/entities/Favorite';

export interface UserChallengeCategoryType {
  userId: string;
  favorites: FavoriteType;
  challengeCategory: Record<
    CategoryKey,
    {
      isBlocked: boolean;
      selectedChallengesIds: string[];
      isAllChallengesSelected: boolean;
      selectedSpecialChallengesIds: string[];
    }
  >;
}
