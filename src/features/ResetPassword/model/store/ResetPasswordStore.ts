import {makeAutoObservable, runInAction} from 'mobx';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';

import {ValidationErrorCodes} from '@src/shared/types/validation';
import {validateEmail} from '@src/shared/lib/validation/emailValidation';
import {FirebaseErrorCodes} from '@src/shared/types/firebase';
import {userStore} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';

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
      crashlytics().log('Resetting user password.');

      const isOffline = await userStore.checkIfUserOfflineAndShowMessage();
      if (isOffline) {
        this.setResetPasswordModalVisible(false);
        return;
      }

      this.setEmailError('');
      const {emailError} = this.validateResetPasswordEmail(this.email);
      if (emailError) {
        this.setEmailError(emailError);
        return;
      }

      runInAction(() => {
        this.isloading = true;
      });

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

    const isInvalidEmail = error.message.includes(
      FirebaseErrorCodes.AUTH_INVALID_EMAIL,
    );
    const isUserNotFound = error.message.includes(
      FirebaseErrorCodes.AUTH_USER_NOT_FOUND,
    );

    if (isInvalidEmail) {
      this.setEmailError(ValidationErrorCodes.INVALID_EMAIL);
    } else if (isUserNotFound) {
      this.setEmailError(ValidationErrorCodes.USER_NOT_FOUNG);
    } else {
      errorHandler({error});
    }
  }
}

export default new ResetPasswordStore();
