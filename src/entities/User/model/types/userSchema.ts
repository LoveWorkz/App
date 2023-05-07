import {CurrentCategory} from '@src/entities/Category';
import {CurrentChallengeCategoryType} from '@src/entities/ChallengeCategory';
import {FavoriteType} from '@src/entities/Favorite';

export interface User {
  id: string;
  photo: string | null;
  email: string;
  name: string | null;
  emailVerified: boolean;
  isAuth: boolean;
  age: number;
  country: string;
  relationshipStatus: string;
  rubric: string;
  category: CurrentCategory;
  challengeCategory: CurrentChallengeCategoryType;
  favorites: FavoriteType;
  quote: QuoeType;
  isWowThatWasFastModalForbidden: boolean;
}

export enum AuthMethod {
  AUTH_BY_GOOGLE = 'google',
  AUTH_BY_EMAIL = 'email',
  AUTH_BY_APPLE = 'apple',
}

export interface InitlUserInfo {
  displayName: string | null;
  email: string;
  photoURL: null | string;
  uid: string;
  emailVerified: boolean;
}

export interface AuthUserInfo {
  user: User | null;
  authMethod: AuthMethod | string;
}

export interface QuoeType {
  isQuoteVisible: boolean;
  quoteCheckingDate: string;
  bookId: string;
}
