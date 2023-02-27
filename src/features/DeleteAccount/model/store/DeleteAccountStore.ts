import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {AuthMethod, userStore} from '@src/entities/User';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {
  AUTH_METHOD_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from '@src/shared/consts/storage';
import {Collections} from '@src/shared/types/firebase';
import {profileStore} from '@src/entities/Profile';
import {DeleteAccountForm, DeleteAccountFormError} from '../../deleteAccount';
import {validateFields} from '../services/validation/validateFields';
import {navigation} from '@src/shared/config/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {ValidationErrorCodes} from '@src/shared/types/validation';

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
        await currentUser.delete();
        await this.clearUserInfo();

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

    if (error.message.includes('auth/invalid-email')) {
      const serverError: DeleteAccountFormError = {
        ...this.errorInfo,
        emailError: ValidationErrorCodes.INVALID_EMAIL,
      };

      this.setServerError(serverError);
    }

    if (
      error.message.includes('auth/wrong-password') ||
      error.message.includes('auth/user-not-found')
    ) {
      const serverError: DeleteAccountFormError = {
        ...this.errorInfo,
        passwordError: ValidationErrorCodes.INVALID_EMAIL_OR_PASSWORD,
      };

      this.setServerError(serverError);
    }
  }

  clearUserInfo = async () => {
    try {
      const value = await authStorage.getAuthData(AUTH_USER_STORAGE_KEY);
      const userFromStorage = JSON.parse(value || '');

      userStore.setAuthUser(null);
      await firestore()
        .collection(Collections.USERS)
        .doc(userFromStorage.id)
        .delete();

      profileStore.clearProfileData();
      await authStorage.removeAuthData(AUTH_USER_STORAGE_KEY);
      await authStorage.removeAuthData(AUTH_METHOD_STORAGE_KEY);
    } catch (e) {
      console.log(e);
    }
  };
}

export default new DeleteAccountStore();
