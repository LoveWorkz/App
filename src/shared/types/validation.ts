export enum ValidationErrorCodes {
  FIELD_IS_REQUIRED = 'auth.field_is_required',
  INVALID_EMAIL = 'auth.invalid_email_address',
  INVALID_EMAIL_OR_PASSWORD = 'auth.incorrect_email_or_password',
  INVALID_PASSWORD = 'auth.invalid_password',
  EMAIL_ALREADY_IN_USE = 'auth.email_is_already_in_use',
  USER_NOT_FOUNG = 'auth.user_not_found',
  SOMETHING_WENT_WRONG = 'auth.something_went_wrong',
  INVALID_AGE = 'auth.invalid_age',
  WEAK_PASSWORD = 'auth.password_must_contain_lowercase',
  USER_IS_DISABLED = 'auth.disabled_account',
}
