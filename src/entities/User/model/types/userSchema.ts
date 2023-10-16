import {CurrentCategory} from '@src/entities/Category';
import {CurrentChallengeCategoryType} from '@src/entities/ChallengeCategory';
import {FavoriteType} from '@src/entities/Favorite';
import {PartnerType} from '@src/entities/Partner';

export interface User {
  id: string;
  photo: string;
  email: string;
  name: string;
  emailVerified: boolean;
  isAuth: boolean;
  age: number;
  country: string;
  relationshipStatus: string;
  preferences: string[];
  category: CurrentCategory;
  challengeCategory: CurrentChallengeCategoryType;
  favorites: FavoriteType;
  quote: QuoeType;
  isWowThatWasFastModalForbidden: boolean;
  hasUserSwipedAnyQuestion: boolean;
  partner: PartnerType;
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
  userId: string;
  authMethod: AuthMethod | string;
}

export interface QuoeType {
  isQuoteVisible: boolean;
  quoteCheckingDate: string;
  bookId: string;
}
