import {
  DeleteAccountForm,
  DeleteAccountFormError,
} from '@src/features/DeleteAccount/deleteAccount';
import {ValidationErrorCodes} from '@src/shared/types/validation';

export const validateFields = (formData: DeleteAccountForm) => {
  let isError = false;

  let errorInfo = {} as DeleteAccountFormError;

  const {email, password} = formData;

  if (!email) {
    errorInfo.emailError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  if (!password) {
    errorInfo.passwordError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  return {isError, errorInfo};
};
