import {
  DeleteAccountForm,
  DeleteAccountFormError,
} from '@src/features/DeleteAccount/deleteAccount';
import {validateEmail} from '@src/shared/lib/validation/emailValidation';
import {ValidationErrorCodes} from '@src/shared/types/validation';

export const validateFields = (formData: DeleteAccountForm) => {
  let isError = false;

  let errorInfo = {} as DeleteAccountFormError;

  const {email, password} = formData;

  const {isEmailError, emailError} = validateEmail(email);
  isError = isError || isEmailError;
  errorInfo = {...errorInfo, ...emailError};

  if (!password) {
    errorInfo.passwordError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  return {isError, errorInfo};
};
