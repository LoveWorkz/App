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
  isResetPasswordModalVisible: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setResetPasswordModalVisible(visible: boolean) {
    this.isResetPasswordModalVisible = visible;
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
  sendPasswordResetEmail = async () => {
    try {
      this.setEmailError('');
      const {emailError} = this.validateResetPasswordEmail(this.email);
      if (emailError) {
        this.setEmailError(emailError);
        return;
      }

      this.isloading = true;

      await auth().sendPasswordResetEmail(this.email);

      this.toggleCheckEmailDialog(true);
      this.setResetPasswordModalVisible(false);
    } catch (error: unknown) {
      this.errorHandler(error);
    } finally {
      runInAction(() => {
        this.isloading = false;
      });
    }
  };

  errorHandler(error: unknown) {
    if (!(error instanceof Error)) {
      return;
    }

    if (error.message.includes(FirebaseErrorCodes.AUTH_INVALID_EMAIL)) {
      this.setEmailError(ValidationErrorCodes.INVALID_EMAIL);
    }

    if (error.message.includes(FirebaseErrorCodes.AUTH_USER_NOT_FOUND)) {
      this.setEmailError(ValidationErrorCodes.USER_NOT_FOUNG);
    }
    console.log(error);
  }
}

export default new ResetPasswordStore();
