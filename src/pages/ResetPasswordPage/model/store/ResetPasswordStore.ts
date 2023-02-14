import {makeAutoObservable} from 'mobx';
import {Alert} from 'react-native';
import auth from '@react-native-firebase/auth';

import {navigation} from '@src/shared/config/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {ValidationErrorCodes} from '@src/shared/types/validation';
import {validateEmail} from '@src/shared/lib/validation/emailValidation';

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

  validateResetPasswordEmail(email: string) {
    const {emailError} = validateEmail(email);

    return emailError;
  }

  sendPasswordResetEmail() {
    this.setEmailError('');
    const {emailError} = this.validateResetPasswordEmail(this.email);
    if (emailError) {
      this.setEmailError(emailError);
      return;
    }

    auth()
      .sendPasswordResetEmail(this.email)
      .then(() => {
        navigation.navigate(AppRouteNames.AUTH);
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
