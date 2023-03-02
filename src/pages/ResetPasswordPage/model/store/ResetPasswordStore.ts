import {makeAutoObservable, runInAction} from 'mobx';
import auth from '@react-native-firebase/auth';

import {ValidationErrorCodes} from '@src/shared/types/validation';
import {validateEmail} from '@src/shared/lib/validation/emailValidation';
import {FirebaseErrorCodes} from '@src/shared/types/firebase';

class ResetPasswordStore {
  email: string = '';
  emailError: string = '';
  isCheckEmailDialogOpen: boolean = false;
  isloading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setEmail(email: string) {
    this.email = email;
  }

  toggleCheckEmailDialog(isOpen: boolean) {
    this.isCheckEmailDialogOpen = isOpen;
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

    this.isloading = true;

    auth()
      .sendPasswordResetEmail(this.email)
      .then(() => {
        this.toggleCheckEmailDialog(true);
      })
      .catch(error => {
        if (error.code === FirebaseErrorCodes.AUTH_INVALID_EMAIL) {
          this.setEmailError(ValidationErrorCodes.INVALID_EMAIL);
        }

        if (error.code === FirebaseErrorCodes.AUTH_USER_NOT_FOUND) {
          this.setEmailError(ValidationErrorCodes.USER_NOT_FOUNG);
        }
        console.log(error);
      })
      .finally(() => {
        runInAction(() => {
          this.isloading = false;
        });
      });
  }
}

export default new ResetPasswordStore();
