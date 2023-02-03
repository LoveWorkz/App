export interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordErrorInfo {
  confirmPasswordError: string;
  oldPasswordError: string;
  newPasswordError: string;
}
