import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';

import {AuthMethod, userFormatter, userStore} from '@src/entities/User';
import {navigate} from '@src/shared/config/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/configRoute';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {AUTH_METHOD_STORAGE_KEY} from '@src/shared/consts/storage';
import {AuthorisedUserByEmail} from '../../../../model/types/authByEmail';
import {SignUpData, SignUpErrorInfo} from '../types/signUp';
import {validateSignUpFields} from '../services/validation/validateFields';

class SignUpStore {
  signUpData: SignUpData = {
    email: '',
    password: '',
    confirmPassword: '',
  };
  errorInfo: SignUpErrorInfo = {
    confirmPasswordError: '',
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

  setConfirmPasswordError(error: string) {
    this.errorInfo.confirmPasswordError = error;
  }

  setAgreeWithPrivacyPolicy(isAgree: boolean) {
    this.agreeWithPrivacyPolicy = isAgree;
  }

  register() {
    if (validateSignUpFields(this.signUpData)) {
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
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  }
}

export default new SignUpStore();
