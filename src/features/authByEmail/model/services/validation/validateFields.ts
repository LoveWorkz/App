import {
  SignUpData,
  SignUpErrorInfo,
} from '../../../ui/SignUp/model/types/signUp';
import {
  SignInData,
  SignInErrorInfo,
} from '../../../ui/SignIn/model/types/signIn';
import {validatePassword} from '@src/shared/lib/validation/passwordValidation';
import {validateEmail} from '@src/shared/lib/validation/emailValidation';
import {validateSignUp} from './signupValidation';
import {ValidationErrorCodes} from '@src/shared/types/validation';

export interface ValidateFields {
  isSignUp: boolean;
  authData: SignUpData | SignInData;
}

export const validateFields = ({isSignUp, authData}: ValidateFields) => {
  let isError = false;

  let errorInfo = {} as SignInErrorInfo | SignUpErrorInfo;

  const {email, password} = authData;

  const {isEmailError, emailError} = validateEmail(email);
  isError = isError || isEmailError;
  errorInfo = {...errorInfo, ...emailError};

  if (!password) {
    errorInfo.passwordError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  if (isSignUp) {
    const {isPasswordError, passwordError} = validatePassword(password);
    isError = isError || isPasswordError;
    errorInfo = {...errorInfo, ...passwordError};

    const {isSignUpError, error} = validateSignUp(authData as SignUpData);
    isError = isError || isSignUpError;
    errorInfo = {...errorInfo, ...error};
  }

  return {isError, errorInfo};
};
