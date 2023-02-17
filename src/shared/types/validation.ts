export enum ValidationErrorCodes {
  FIELD_IS_REQUIRED = 'Field is required',
  INVALID_EMAIL = 'Invalid email address',
  INVALID_EMAIL_OR_PASSWORD = 'Incorrect email or password',
  PASSWORD_MAX_LENGHT_30 = 'Max length is 30',
  PASSWORD_MIN_LENGHT_8 = 'Min length is 8',
  INVALID_PASSWORD = 'Invalid password',
  EMAIL_ALREADY_IN_USE = 'The email address is already in use by another account',
  USER_NOT_FOUNG = 'User not found',
  SOMETHING_WENT_WRONG = 'Something went wrong',
  INVALID_AGE = 'invalid age',
  WEAK_PASSWORD = 'Password must contain lowercase, uppercase, number, special character (#,$,@,!,_,%,&,*,?) and at least 8 characters in length',
}
