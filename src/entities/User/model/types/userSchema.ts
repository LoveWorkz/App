import {CurrentCategory} from '@src/entities/Category';
import {CurrentChallengeCategoryType} from '@src/entities/ChallengeCategory';
import {FavoriteType} from '@src/entities/Favorite';

export interface User {
  id: string;
  photo: string;
  email: string;
  name: string;
  emailVerified: boolean;
  isAuth: boolean;
  country: string;
  category: CurrentCategory;
  challengeCategory: CurrentChallengeCategoryType;
  quote: QuoeType;
  isWowThatWasFastModalForbidden: boolean;
  hasUserSwipedAnyQuestion: boolean;
  hasUserRated: boolean;
  gender: string;
  selectedGoalsIds: string[];
  birthDate: string;
  notification: Notification;
}

export interface Notification {
  lastSessionDate: string | Date;
  fcmToken: string;
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
