import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {AuthMethod, User, userFormatter, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/config/navigation/navigation';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {
  AUTH_METHOD_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from '@src/shared/consts/storage';
import {ValidationErrorCodes} from '@src/shared/types/validation';
import {Collections} from '@src/shared/types/types';
import {InitlUserInfo} from '@src/entities/User';
import {SignInData, SignInErrorInfo} from '../types/signIn';
import {validateFields} from '../../../../model/services/validation/validateFields';

class SignInStore {
  signInData: SignInData = {
    email: '',
    password: '',
  };
  errorInfo: SignInErrorInfo = {
    emailError: '',
    passwordError: '',
  };
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setEmail(email: string) {
    this.signInData.email = email;
  }

  setPassword(password: string) {
    this.signInData.password = password;
  }

  setValidationError(errorInfo: SignInErrorInfo) {
    this.errorInfo = errorInfo;
  }

  setServerError(errorInfo: SignInErrorInfo) {
    this.errorInfo = errorInfo;
  }

  setIsloading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  clearErrors() {
    this.setValidationError({
      emailError: '',
      passwordError: '',
    });
  }

  resetForm() {
    this.setEmail('');
    this.setPassword('');
    this.clearErrors();
  }

  setUser = async (user: User) => {
    userStore.setAuthUser(user);

    await authStorage.setAuthData(
      AUTH_METHOD_STORAGE_KEY,
      AuthMethod.AUTH_BY_EMAIL,
    );
    userStore.setAuthMethod(AuthMethod.AUTH_BY_EMAIL);
    await authStorage.setAuthData(AUTH_USER_STORAGE_KEY, JSON.stringify(user));

    await firestore().collection(Collections.USERS).doc(user.id).update({
      isAuth: true,
    });
  };

  signIn = async () => {
    try {
      this.clearErrors();

      const {isError, errorInfo} = validateFields({
        isSignUp: false,
        authData: this.signInData,
      });

      if (isError) {
        this.setValidationError(errorInfo);
        return;
      }

      this.setIsloading(true);

      await auth().signInWithEmailAndPassword(
        this.signInData.email,
        this.signInData.password,
      );

      const currentUser = auth().currentUser;
      const formattedUser = userFormatter(currentUser as InitlUserInfo);
      await this.setUser(formattedUser);

      this.setIsloading(false);
      navigation.replace(AppRouteNames.MAIN);
    } catch (error: unknown) {
      this.setIsloading(false);
      this.errorHandler(error);
    }
  };

  errorHandler(error: unknown) {
    if (!(error instanceof Error)) {
      return;
    }

    if (error.message.includes('auth/invalid-email')) {
      const serverError: SignInErrorInfo = {
        ...this.errorInfo,
        emailError: ValidationErrorCodes.INVALID_EMAIL,
      };

      this.setServerError(serverError);
    }

    if (
      error.message.includes('auth/wrong-password') ||
      error.message.includes('auth/user-not-found')
    ) {
      const serverError: SignInErrorInfo = {
        ...this.errorInfo,
        passwordError: ValidationErrorCodes.INVALID_EMAIL_OR_PASSWORD,
      };

      this.setServerError(serverError);
    }
  }
}

export default new SignInStore();
