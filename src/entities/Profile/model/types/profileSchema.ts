import {CurrentCategory} from '@src/entities/Category';
import {CurrentChallengeCategoryType} from '@src/entities/ChallengeCategory';
import {FavoriteType} from '@src/entities/Favorite';
import {QuoeType} from '@src/entities/User';

export interface Profile {
  id: string;
  photo: string;
  email: string;
  name: string;
  emailVerified: boolean;
  isAuth: boolean;
  age: string;
  country: string;
  relationshipStatus: string;
  rubric: string;
  favorites: FavoriteType;
  category: CurrentCategory;
  challengeCategory: CurrentChallengeCategoryType;
  quote: QuoeType;
  isWowThatWasFastModalForbidden: boolean;
}

export interface ProfileErrorInfo {
  nameError: string;
  ageError: string;
  countryError: string;
  relationshipStatusError: string;
  rubricError: string;
}

export enum ProfilePhotoActionType {
  DELETE = 'delete',
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
}
