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
}

export interface UserChallengeCategoryType {
  userId: string;
  challengeCategory: any;
}

export interface CurrentChallengeCategoryType {
  currentChallengeCategory: string;
  currentChallengeCategoryId: string;
}
