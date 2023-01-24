import {
  SignUpData,
  SignUpErrorInfo,
} from '../../../ui/SignUp/model/types/signUp';
import {
  SignInData,
  SignInErrorInfo,
} from '../../../ui/SignIn/model/types/signIn';
import {ValidationErrorCodes} from '@src/shared/types/validation';

export interface ValidateFields {
  isSignUp: boolean;
  authData: SignUpData | SignInData;
}

export const validateFields = ({isSignUp, authData}: ValidateFields) => {
  let isError = false;

  let errorInfo = {} as SignInErrorInfo | SignUpErrorInfo;

  const {email, password} = authData;

  if (!email) {
    errorInfo.emailError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  if (password.length < 6) {
    errorInfo.passwordError = ValidationErrorCodes.PASSWORD_MIN_LENGHT_6;
    isError = true;
  }

  if (!password) {
    errorInfo.passwordError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  if (password.length > 8) {
    errorInfo.passwordError = ValidationErrorCodes.PASSWORD_MAX_LENGHT_8;
    isError = true;
  }

  if (isSignUp) {
    const {isSignUpError, error} = validateSignUp(authData as SignUpData);
    isError = isError || isSignUpError;
    errorInfo = {...errorInfo, ...error};
  }

  return {isError, errorInfo};
};

const validateSignUp = (authData: SignUpData) => {
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
