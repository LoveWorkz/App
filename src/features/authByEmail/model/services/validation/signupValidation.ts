import {ValidationErrorCodes} from '@src/shared/types/validation';
import {
  SignUpData,
  SignUpErrorInfo,
} from '../../../ui/SignUp/model/types/signUp';

export const validateSignUp = (authData: SignUpData) => {
  const error = {} as SignUpErrorInfo;
  const {password, confirmPassword} = authData;
  let isSignUpError = false;

  if (!confirmPassword.length) {
    error.confirmPasswordError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isSignUpError = true;
  }

  if (password !== confirmPassword) {
    error.confirmPasswordError = ValidationErrorCodes.INVALID_PASSWORD;
    isSignUpError = true;
  }

  return {isSignUpError, error};
};
