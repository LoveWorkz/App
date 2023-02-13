import {validatePassword} from '@src/shared/lib/validation/passwordValidation';
import {ValidationErrorCodes} from '@src/shared/types/validation';
import {
  ChangePasswordErrorInfo,
  ChangePasswordFormData,
} from '../../types/changePassword';

export const validateFields = (formData: ChangePasswordFormData) => {
  let isError = false;

  let errorInfo = {} as ChangePasswordErrorInfo;

  const {oldPassword, newPassword, confirmPassword} = formData;

  if (!oldPassword) {
    errorInfo.oldPasswordError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  if (!confirmPassword) {
    errorInfo.confirmPasswordError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  if (newPassword !== confirmPassword) {
    errorInfo.confirmPasswordError = ValidationErrorCodes.INVALID_PASSWORD;
    isError = true;
  }

  const {isPasswordError, passwordError} = validatePassword(newPassword);
  isError = isError || isPasswordError;
  errorInfo = {...errorInfo, ...passwordError};

  return {isError, errorInfo};
};
