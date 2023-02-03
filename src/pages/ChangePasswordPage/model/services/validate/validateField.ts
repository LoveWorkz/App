import {ValidationErrorCodes} from '@src/shared/types/validation';
import {
  ChangePasswordErrorInfo,
  ChangePasswordFormData,
} from '../../types/changePassword';

export const validateFields = (formData: ChangePasswordFormData) => {
  let isError = false;

  let errorInfo = {} as ChangePasswordErrorInfo;

  const {oldPassword, newPassword, confirmPassword} = formData;

  if (newPassword.length < 6) {
    errorInfo.newPasswordError = ValidationErrorCodes.PASSWORD_MIN_LENGHT_6;
    isError = true;
  }

  if (!newPassword) {
    errorInfo.newPasswordError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  if (!oldPassword) {
    errorInfo.oldPasswordError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  if (!confirmPassword) {
    errorInfo.confirmPasswordError = ValidationErrorCodes.FIELD_IS_REQUIRED;
    isError = true;
  }

  if (newPassword.length > 8) {
    errorInfo.newPasswordError = ValidationErrorCodes.PASSWORD_MAX_LENGHT_8;
    isError = true;
  }

  if (newPassword !== confirmPassword) {
    errorInfo.confirmPasswordError = ValidationErrorCodes.INVALID_PASSWORD;
    isError = true;
  }

  return {isError, errorInfo};
};
