import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';

import {AuthMethod, userFormatter, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/configRoute';
import {navigate} from '@src/shared/config/navigation/navigation';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {AUTH_METHOD_STORAGE_KEY} from '@src/shared/consts/storage';
import {ValidationErrorCodes} from '@src/shared/types/validation';
import {AuthorisedUserByEmail} from '../../../../model/types/authByEmail';
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

  singIn() {
    this.clearErrors();

    const {isError, errorInfo} = validateFields({
      isSignUp: false,
      authData: this.signInData,
    });

    if (isError) {
      this.setValidationError(errorInfo);
      return;
    }

    auth()
      .signInWithEmailAndPassword(
        this.signInData.email,
        this.signInData.password,
      )
      .then(user => {
        const formattedUser = userFormatter(
          user as AuthorisedUserByEmail,
          AuthMethod.AUTH_BY_EMAIL,
        );

        userStore.setAuthUser(formattedUser);

        navigate(AppRouteNames.MAIN);

        authStorage.setAuthData(
          AUTH_METHOD_STORAGE_KEY,
          AuthMethod.AUTH_BY_EMAIL,
        );
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          const serverError: SignInErrorInfo = {
            ...this.errorInfo,
            emailError: ValidationErrorCodes.INVALID_EMAIL,
          };

          this.setServerError(serverError);
        }

        if (
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/user-not-found'
        ) {
          const serverError: SignInErrorInfo = {
            ...this.errorInfo,
            passwordError: ValidationErrorCodes.INVALID_EMAIL_OR_PASSWORD,
          };

          this.setServerError(serverError);
        }
      });
  }
}

export default new SignInStore();
