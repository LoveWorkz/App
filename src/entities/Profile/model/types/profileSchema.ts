import {PartnerType} from '@src/entities/Partner';

export interface Profile {
  photo: string;
  name: string;
  country: string;
  preferences: string[];
  partner: PartnerType;
  gender: string;
  email: string;
}

export interface ProfileErrorInfo {
  nameError: string;
  countryError: string;
  preferenceError: string;
  emailError: string;
  genderError: string;
}

export enum ProfilePhotoActionType {
  DELETE = 'delete',
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
}
