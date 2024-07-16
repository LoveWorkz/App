import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import appleAuth from '@invertase/react-native-apple-authentication';
import {statusCodes} from '@react-native-google-signin/google-signin';

import {AuthMethod, userStore} from '@src/entities/User';
import {FirebaseErrorCodes} from '@src/shared/types/firebase';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {ValidationErrorCodes} from '@src/shared/types/validation';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
import {DeleteAccountForm, DeleteAccountFormError} from '../../deleteAccount';
import {validateFields} from '../services/validation/validateFields';

import {GoogleSignin} from '@react-native-google-signin/google-signin';

class DeleteAccountStore {
  formData: DeleteAccountForm = {
    password: '',
    email: '',
  };
  errorInfo: DeleteAccountFormError = {
    emailError: '',
    passwordError: '',
  };
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setPassword(password: string) {
    this.formData.password = password;
  }

  setEmail(email: string) {
    this.formData.email = email;
  }

  setValidationError(errorInfo: DeleteAccountFormError) {
    this.errorInfo = errorInfo;
  }

  setServerError(errorInfo: DeleteAccountFormError) {
    this.errorInfo = errorInfo;
  }

  clearErrors() {
    this.setValidationError({
      passwordError: '',
      emailError: '',
    });
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  resetForm() {
    this.setEmail('');
    this.setEmail('');
    this.clearErrors();
  }

  deleteUserAccount = async (actionAfterDeleting: () => void) => {
    try {
      crashlytics().log('Deleting user account.');

      const isOffline = await userStore.checkIfUserOfflineAndShowMessage();
      if (isOffline) {
        actionAfterDeleting();

        return;
      }

      const isAuthMethodEmail =
        userStore.authMethod === AuthMethod.AUTH_BY_EMAIL;

      this.clearErrors();
      const {errorInfo, isError} = validateFields(this.formData);
      if (isError && isAuthMethodEmail) {
        this.setValidationError(errorInfo);
        return;
      }

      this.setIsLoading(true);
      let isCorrectUser;

      if (isAuthMethodEmail) {
        isCorrectUser = await userStore.reauthenticateWithCredential({
          email: this.formData.email,
          password: this.formData.password,
          erorHandler: e => this.erorHandler(e),
        });
      } else {
        isCorrectUser = await userStore.reauthenticateWithCredential({
          erorHandler: e => this.erorHandler(e),
        });
      }

      if (!isCorrectUser) {
        return;
      }

      const currentUser = auth().currentUser;
      if (currentUser) {
        await currentUser.delete();
        await userStore.clearUserInfoAfterDeletion(currentUser.uid);

        actionAfterDeleting();
        navigation.resetHistoryAndNavigate(AppRouteNames.AUTH);
        this.setIsLoading(false);
        GoogleSignin.signOut();
      }
    } catch (e) {
      errorHandler({error: e});
    } finally {
      this.setIsLoading(false);
    }
  };

  erorHandler(error: any) {
    const isInvalidEmail = error.message.includes(
      FirebaseErrorCodes.AUTH_INVALID_EMAIL,
    );
    const isWrongPassword = error.message.includes(
      FirebaseErrorCodes.AUTH_WRONG_PASSWORD,
    );
    const isUserNotFound = error.message.includes(
      FirebaseErrorCodes.AUTH_USER_NOT_FOUND,
    );

    if (isInvalidEmail) {
      const serverError: DeleteAccountFormError = {
        ...this.errorInfo,
        emailError: ValidationErrorCodes.INVALID_EMAIL,
      };

      this.setServerError(serverError);
    } else if (isWrongPassword || isUserNotFound) {
      const serverError: DeleteAccountFormError = {
        ...this.errorInfo,
        passwordError: ValidationErrorCodes.INVALID_EMAIL_OR_PASSWORD,
      };

      this.setServerError(serverError);
    } else {
      const appleCanceled = error.code === appleAuth.Error.CANCELED;
      const googleCanceled = error.code === statusCodes.SIGN_IN_CANCELLED;

      const isUserCanceledAuthorisation = appleCanceled || googleCanceled;

      if (isUserCanceledAuthorisation) {
        return;
      }

      errorHandler({error});
    }
  }
}

export default new DeleteAccountStore();
