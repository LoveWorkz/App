import {FavoriteType} from '@src/entities/Favorite';

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
