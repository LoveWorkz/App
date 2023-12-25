export interface Profile {
  photo: string;
  name: string;
  country: string;
  gender: string;
  email: string;
  birthDate: string;
}

export interface ProfileErrorInfo {
  nameError: string;
  countryError: string;
  emailError: string;
  genderError: string;
  birthDateError: string;
}

export enum ProfilePhotoActionType {
  DELETE = 'delete',
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
}
