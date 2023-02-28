import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {AuthMethod, userStore} from '@src/entities/User';
import {Collections, FirebaseErrorCodes} from '@src/shared/types/firebase';
import {navigation} from '@src/shared/config/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {ValidationErrorCodes} from '@src/shared/types/validation';
import {DeleteAccountForm, DeleteAccountFormError} from '../../deleteAccount';
import {validateFields} from '../services/validation/validateFields';

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
      const isAuthMethodEmail =
        userStore.authMethod === AuthMethod.AUTH_BY_EMAIL;

      this.clearErrors();
      const {errorInfo, isError} = validateFields(this.formData);
      if (isError && isAuthMethodEmail) {
        this.setValidationError(errorInfo);
        return;
      }

      this.setIsLoading(true);
      let isCorrectUserData;

      if (isAuthMethodEmail) {
        isCorrectUserData = await userStore.reauthenticate({
          email: this.formData.email,
          password: this.formData.password,
          erorHandler: e => this.erorHandler(e),
        });
      } else {
        isCorrectUserData = await userStore.reauthenticate({
          erorHandler: e => this.erorHandler(e),
        });
      }

      if (!isCorrectUserData) {
        return;
      }

      const currentUser = auth().currentUser;
      if (currentUser) {
        !isAuthMethodEmail && (await GoogleSignin.signOut());

        await firestore()
        .collection(Collections.USERS)
        .doc(currentUser.uid)
        .delete();
        await currentUser.delete();
        await userStore.clearUserInfo();

        actionAfterDeleting();
        navigation.resetHistoryAndNavigate(AppRouteNames.AUTH);
        this.setIsLoading(false);
      }
    } catch (e) {
      this.setIsLoading(false);
      console.log(e);
    }
  };

  erorHandler(error: unknown) {
    if (!(error instanceof Error)) {
      return;
    }

    this.setIsLoading(false);

    if (error.message.includes(FirebaseErrorCodes.AUTH_INVALID_EMAIL)) {
      const serverError: DeleteAccountFormError = {
        ...this.errorInfo,
        emailError: ValidationErrorCodes.INVALID_EMAIL,
      };

      this.setServerError(serverError);
    }

    if (
      error.message.includes(FirebaseErrorCodes.AUTH_WRONG_PASSWORD) ||
      error.message.includes(FirebaseErrorCodes.AUTH_USER_NOT_FOUND)
    ) {
      const serverError: DeleteAccountFormError = {
        ...this.errorInfo,
        passwordError: ValidationErrorCodes.INVALID_EMAIL_OR_PASSWORD,
      };

      this.setServerError(serverError);
    }
  }
}

export default new DeleteAccountStore();
