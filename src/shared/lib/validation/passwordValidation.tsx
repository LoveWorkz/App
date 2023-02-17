import {weakPasswordRegexp} from '@src/shared/consts/validation';
import {ValidationErrorCodes} from '@src/shared/types/validation';

export const validatePassword = (password: string) => {
  let isPasswordError = false;
  let passwordError = {} as Record<string, ValidationErrorCodes>;

  if (!weakPasswordRegexp.test(password)) {
    passwordError.passwordError = ValidationErrorCodes.WEAK_PASSWORD;
    isPasswordError = true;
  }

  if (!password) {
    passwordError.passwordError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isPasswordError = true;
  }

  return {isPasswordError, passwordError};
};
