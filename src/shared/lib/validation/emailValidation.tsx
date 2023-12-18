import {emailRegexp} from '@src/shared/consts/validation';
import {ValidationErrorCodes} from '@src/shared/types/validation';

export const validateEmail = (email: string) => {
  let isEmailError = false;
  let emailError = {} as Record<string, ValidationErrorCodes>;

  if (!emailRegexp.test(email)) {
    emailError.emailError = ValidationErrorCodes.INVALID_EMAIL;
    isEmailError = true;
  }

  if (!email) {
    emailError.emailError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isEmailError = true;
  }

  return {isEmailError, emailError};
};
