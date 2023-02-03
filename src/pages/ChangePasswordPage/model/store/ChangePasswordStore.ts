import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';

import {userStore} from '@src/entities/User';
import {
  ChangePasswordErrorInfo,
  ChangePasswordFormData,
} from '../types/changePassword';
import {validateFields} from '../services/validate/validateField';
import {ValidationErrorCodes} from '@src/shared/types/validation';
import {navigate} from '@src/shared/config/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

class ChangePasswordStore {
  formData: ChangePasswordFormData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  errorInfo: ChangePasswordErrorInfo = {
    oldPasswordError: '',
    newPasswordError: '',
    confirmPasswordError: '',
  };

  constructor() {
    makeAutoObservable(this);
  }

  setOldPassword(oldPassword: string) {
    this.formData.oldPassword = oldPassword;
  }

  setNewPassword(newPassword: string) {
    this.formData.newPassword = newPassword;
  }

  setConfirmPassword(confirmPassword: string) {
    this.formData.confirmPassword = confirmPassword;
  }

  setValidationError(errorInfo: ChangePasswordErrorInfo) {
    this.errorInfo = errorInfo;
  }

  setServerError(errorInfo: ChangePasswordErrorInfo) {
    this.errorInfo = errorInfo;
  }

  clearErrors() {
    this.setValidationError({
      newPasswordError: '',
      oldPasswordError: '',
      confirmPasswordError: '',
    });
  }

  resetForm() {
    this.setOldPassword('');
    this.setNewPassword('');
    this.setConfirmPassword('');
    this.clearErrors();
  }

  reauthenticate = async () => {
    try {
      const email = userStore.authUser?.email;
      if (email && this.formData.oldPassword) {
        const user = auth.EmailAuthProvider.credential(
          email,
          this.formData.oldPassword,
        );
        const currentUser = auth().currentUser;
        await currentUser?.reauthenticateWithCredential(user);
        return true;
      }
    } catch (e) {
      console.log(e);
      this.errorHandler(e);
      return false;
    }
  };

  errorHandler(error: unknown) {
    if (!(error instanceof Error)) {
      return;
    }

    if (error.message.includes('auth/wrong-password')) {
      const serverError: ChangePasswordErrorInfo = {
        ...this.errorInfo,
        oldPasswordError: ValidationErrorCodes.INVALID_PASSWORD,
      };

      this.setServerError(serverError);
    }
  }

  changePassword = async () => {
    this.clearErrors();

    const {isError, errorInfo} = validateFields(this.formData);

    if (isError) {
      this.setValidationError(errorInfo);
      return;
    }

    try {
      const currentUser = auth().currentUser;
      const isCorrectPassword = await this.reauthenticate();

      if (currentUser && this.formData.newPassword && isCorrectPassword) {
        currentUser.updatePassword(this.formData.newPassword);
      }
      navigate(AppRouteNames.PROFILE);
    } catch (e) {
      console.log(e);
    }
  };
}

export default new ChangePasswordStore();
