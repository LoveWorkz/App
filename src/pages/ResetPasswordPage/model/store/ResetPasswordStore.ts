import {makeAutoObservable} from 'mobx';
import {Alert} from 'react-native';
import auth from '@react-native-firebase/auth';

import {navigate} from '@src/shared/config/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {ValidationErrorCodes} from '@src/shared/types/validation';

class ResetPasswordStore {
  email: string = '';
  emailError: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setEmail(email: string) {
    this.email = email;
  }

  resetForm() {
    this.setEmail('');
    this.setEmailError('');
  }

  setEmailError(emailError: string) {
    this.emailError = emailError;
  }

  validateEmail(email: string) {
    let error = '';
    if (!email) {
      error = ValidationErrorCodes.FIELD_IS_REQUIRED;
    }

    return error;
  }

  sendPasswordResetEmail() {
    this.setEmailError('');
    const errorInfo = this.validateEmail(this.email);
    if (errorInfo) {
      this.setEmailError(errorInfo);
      return;
    }

    auth()
      .sendPasswordResetEmail(this.email)
      .then(() => {
        navigate(AppRouteNames.AUTH);
        Alert.alert('check your email');
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          this.setEmailError(ValidationErrorCodes.INVALID_EMAIL);
        }

        if (error.code === 'auth/user-not-found') {
          this.setEmailError(ValidationErrorCodes.USER_NOT_FOUNG);
        }
      });
  }
}

export default new ResetPasswordStore();
