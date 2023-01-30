import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {AuthMethod, User, userFormatter, userStore} from '@src/entities/User';
import {navigate} from '@src/shared/config/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {ValidationErrorCodes} from '@src/shared/types/validation';
import {
  AUTH_METHOD_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from '@src/shared/consts/storage';
import {Collections} from '@src/shared/types/types';
import {InitlUserInfo} from '@src/entities/User';
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

  resetForm() {
    this.setEmail('');
    this.setPassword('');
    this.setConfirmPassword('');
    this.setAgreeWithPrivacyPolicy(false);
    this.clearErrors();
  }

  setUser = async (user: User) => {
    userStore.setAuthUser(user);

    await authStorage.setAuthData(
      AUTH_METHOD_STORAGE_KEY,
      AuthMethod.AUTH_BY_EMAIL,
    );
    await authStorage.setAuthData(AUTH_USER_STORAGE_KEY, JSON.stringify(user));

    await firestore()
      .collection(Collections.USERS)
      .doc(user.id)
      .set({
        ...user,
        isAuth: true,
      });
  };

  register = async () => {
    try {
      this.clearErrors();

      const {isError, errorInfo} = validateFields({
        isSignUp: true,
        authData: this.signUpData,
      });

      if (isError) {
        this.setValidationError(errorInfo as SignUpErrorInfo);
        return;
      }

      await auth().createUserWithEmailAndPassword(
        this.signUpData.email,
        this.signUpData.password,
      );
      await auth().currentUser?.sendEmailVerification();

      const currentUser = auth().currentUser;
      const formattedUser = userFormatter(currentUser as InitlUserInfo);
      await this.setUser(formattedUser);

      navigate(AppRouteNames.MAIN);
    } catch (error: unknown) {
      this.errorHandler(error);
    }
  };

  errorHandler(error: unknown) {
    if (!(error instanceof Error)) {
      return;
    }

    if (error.message.includes('auth/email-already-in-use')) {
      const serverError: SignUpErrorInfo = {
        ...this.errorInfo,
        emailError: ValidationErrorCodes.EMAIL_ALREADY_IN_USE,
      };

      this.setServerError(serverError);
    }

    if (error.message.includes('auth/invalid-email')) {
      const serverError: SignUpErrorInfo = {
        ...this.errorInfo,
        emailError: ValidationErrorCodes.INVALID_EMAIL,
      };

      this.setServerError(serverError);
    }
  }
}

export default new SignUpStore();
