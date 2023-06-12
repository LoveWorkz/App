export interface Profile {
  photo: string;
  name: string;
  age: string;
  country: string;
  relationshipStatus: string;
  preferences: string[];
}

export interface ProfileErrorInfo {
  nameError: string;
  ageError: string;
  countryError: string;
  relationshipStatusError: string;
  preferenceError: string;
}

export enum ProfilePhotoActionType {
  DELETE = 'delete',
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
}
