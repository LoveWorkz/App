import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';

import {userStore} from '@src/entities/User';
import {ValidationErrorCodes} from '@src/shared/types/validation';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {FirebaseErrorCodes} from '@src/shared/types/firebase';
import {
  ChangePasswordErrorInfo,
  ChangePasswordFormData,
} from '../types/changePassword';
import {validateFields} from '../services/validate/validateField';

class ChangePasswordStore {
  formData: ChangePasswordFormData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  errorInfo: ChangePasswordErrorInfo = {
    oldPasswordError: '',
    passwordError: '',
    confirmPasswordError: '',
  };
  isLoading: boolean = false;

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

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  clearErrors() {
    this.setValidationError({
      passwordError: '',
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

  errorHandler(error: unknown) {
    if (!(error instanceof Error)) {
      return;
    }

    if (error.message.includes(FirebaseErrorCodes.AUTH_WRONG_PASSWORD)) {
      const serverError: ChangePasswordErrorInfo = {
        ...this.errorInfo,
        oldPasswordError: ValidationErrorCodes.INVALID_PASSWORD,
      };

      this.setServerError(serverError);
    }
  }

  changePassword = async () => {
    try {
      this.clearErrors();

      const {isError, errorInfo} = validateFields(this.formData);

      if (isError) {
        this.setValidationError(errorInfo);
        return;
      }

      this.setIsLoading(true);

      const currentUser = auth().currentUser;
      const isCorrectPassword = await userStore.reauthenticate({
        email: auth().currentUser?.email || '',
        password: this.formData.oldPassword,
        erorHandler: e => this.errorHandler(e),
      });

      if (currentUser && this.formData.newPassword && isCorrectPassword) {
        currentUser.updatePassword(this.formData.newPassword);
        navigation.navigate(AppRouteNames.PROFILE);
      }
      this.setIsLoading(false);
    } catch (e) {
      this.setIsLoading(false);
      console.log(e);
    }
  };
}

export default new ChangePasswordStore();
