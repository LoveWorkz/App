import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';

import {AuthMethod, User, userFormatter, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {ValidationErrorCodes} from '@src/shared/types/validation';
import {FirebaseErrorCodes} from '@src/shared/types/firebase';
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
    userStore.setAuthUserInfo({
      user,
      authMethod: AuthMethod.AUTH_BY_EMAIL,
    });

    userStore.updateUser({
      field: 'isAuth',
      data: true,
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
      navigation.replace(AppRouteNames.TAB_ROUTE);
    } catch (error: unknown) {
      this.setIsloading(false);
      this.errorHandler(error);
    }
  };

  errorHandler(error: unknown) {
    if (!(error instanceof Error)) {
      return;
    }

    if (error.message.includes(FirebaseErrorCodes.AUTH_INVALID_EMAIL)) {
      const serverError: SignInErrorInfo = {
        ...this.errorInfo,
        emailError: ValidationErrorCodes.INVALID_EMAIL,
      };

      this.setServerError(serverError);
    }

    if (
      error.message.includes(FirebaseErrorCodes.AUTH_WRONG_PASSWORD) ||
      error.message.includes(FirebaseErrorCodes.AUTH_USER_NOT_FOUND)
    ) {
      const serverError: SignInErrorInfo = {
        ...this.errorInfo,
        passwordError: ValidationErrorCodes.INVALID_EMAIL_OR_PASSWORD,
      };

      this.setServerError(serverError);
    }

    if (error.message.includes(FirebaseErrorCodes.AUTH_USER_DISABLED)) {
      const serverError: SignInErrorInfo = {
        ...this.errorInfo,
        emailError: ValidationErrorCodes.USER_IS_DISABLED,
      };

      this.setServerError(serverError);
    }
  }
}

export default new SignInStore();
