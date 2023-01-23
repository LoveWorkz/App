export interface InitlUserInfo {
  displayName: string | null;
  email: string;
  photoURL: null | string;
  uid: string;
}

export interface AuthorisedUserByEmail {
  user: InitlUserInfo;
}

export enum AuthErrorCodes {
  FIELD_IS_REQUIRED = 'Field is required',
  INVALID_EMAIL = 'Invalid email address',
  INVALID_EMAIL_OR_PASSWORD = 'Incorrect email or password',
  PASSWORD_MAX_LENGHT_8 = 'Max length is 8',
  PASSWORD_MIN_LENGHT_6 = 'Min length is 6',
  INVALID_PASSWORD = 'Invalid password',
  EMAIL_ALREADY_IN_USE = 'The email address is already in use by another account',
}
