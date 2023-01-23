import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';

import {AuthMethod, userFormatter, userStore} from '@src/entities/User';
import {navigate} from '@src/shared/config/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/configRoute';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {AUTH_METHOD_STORAGE_KEY} from '@src/shared/consts/storage';
import {
  AuthErrorCodes,
  AuthorisedUserByEmail,
} from '../../../../model/types/authByEmail';
import {SignUpData, SignUpErrorInfo} from '../types/signUp';
import {validateFields} from '../../../../model/services/validation/validateFields';

class SignUpStore {
  signUpData: SignUpData = {
    email: '',
    password: '',
    confirmPassword: '',
  };
  errorInfo: SignUpErrorInfo = {
    confirmPasswordError: '',
    emailError: '',
    passwordError: '',
  };
  agreeWithPrivacyPolicy: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setEmail(email: string) {
    this.signUpData.email = email;
  }

  setPassword(password: string) {
    this.signUpData.password = password;
  }

  setConfirmPassword(password: string) {
    this.signUpData.confirmPassword = password;
  }

  setAgreeWithPrivacyPolicy(isAgree: boolean) {
    this.agreeWithPrivacyPolicy = isAgree;
  }

  setValidationError(errorInfo: SignUpErrorInfo) {
    this.errorInfo = errorInfo;
  }

  setServerError(errorInfo: SignUpErrorInfo) {
    this.errorInfo = errorInfo;
  }

  clearErrors() {
    this.setValidationError({
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
    });
  }

  register() {
    this.clearErrors();

    const {isError, errorInfo} = validateFields({
      isSignUp: true,
      authData: this.signUpData,
    });

    if (isError) {
      this.setValidationError(errorInfo as SignUpErrorInfo);
      return;
    }

    auth()
      .createUserWithEmailAndPassword(
        this.signUpData.email,
        this.signUpData.password,
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
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          const serverError: SignUpErrorInfo = {
            ...this.errorInfo,
            emailError: AuthErrorCodes.EMAIL_ALREADY_IN_USE,
          };

          this.setServerError(serverError);
        }

        if (error.code === 'auth/invalid-email') {
          const serverError: SignUpErrorInfo = {
            ...this.errorInfo,
            emailError: AuthErrorCodes.INVALID_EMAIL,
          };

          this.setServerError(serverError);
        }
        console.log(error, 'erro');
      });
  }
}

export default new SignUpStore();
