import {
  LovercaseRegexp,
  specSymbolsRegexp,
  uppercaseRegexp,
} from '@src/shared/consts/validation';
import {ValidationErrorCodes} from '@src/shared/types/validation';

export const validatePassword = (password: string) => {
  let isPasswordError = false;
  let passwordError = {} as Record<string, ValidationErrorCodes>;

  if (!uppercaseRegexp.test(password) || !LovercaseRegexp.test(password)) {
    passwordError.passwordError = ValidationErrorCodes.WEAK_PASSWORD;
    isPasswordError = true;
  }

  if (specSymbolsRegexp.test(password)) {
    passwordError.passwordError = ValidationErrorCodes.SPEC_SYMBOLS;
    isPasswordError = true;
  }

  if (password.length < 8) {
    passwordError.passwordError = ValidationErrorCodes.PASSWORD_MIN_LENGHT_8;
    isPasswordError = true;
  }

  if (password.length > 30) {
    passwordError.passwordError = ValidationErrorCodes.PASSWORD_MAX_LENGHT_30;
    isPasswordError = true;
  }

  if (!password) {
    passwordError.passwordError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isPasswordError = true;
  }

  return {isPasswordError, passwordError};
};
