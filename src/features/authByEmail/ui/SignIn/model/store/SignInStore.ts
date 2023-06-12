import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';

import {AuthMethod, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {ValidationErrorCodes} from '@src/shared/types/validation';
import {FirebaseErrorCodes} from '@src/shared/types/firebase';
import {InitlUserInfo} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
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

  setUser = async (user: InitlUserInfo) => {
    try {
      userStore.setAuthUserInfo({
        userId: user.uid,
        authMethod: AuthMethod.AUTH_BY_EMAIL,
      });

      await userStore.updateUser({
        field: 'isAuth',
        data: true,
      });

      await userStore.checkAndSetUserVisitStatus({isSignUp: false});
    } catch (e) {
      errorHandler({error: e});
    }
  };

  signIn = async () => {
    try {
      const isOffline = await userStore.checkIfUserOfflineAndShowMessage();
      if (isOffline) {
        return;
      }

      crashlytics().log('User tried to sign in with Email.');

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
      await this.setUser(currentUser as InitlUserInfo);

      crashlytics().log('User signed in with Email.');
      currentUser && crashlytics().setUserId(currentUser.uid);

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

    const isInvalidEmail = error.message.includes(
      FirebaseErrorCodes.AUTH_INVALID_EMAIL,
    );
    const isWrongPassword = error.message.includes(
      FirebaseErrorCodes.AUTH_WRONG_PASSWORD,
    );
    const isUserNotFound = error.message.includes(
      FirebaseErrorCodes.AUTH_USER_NOT_FOUND,
    );
    const isUserDisabled = error.message.includes(
      FirebaseErrorCodes.AUTH_USER_DISABLED,
    );

    if (isInvalidEmail) {
      const serverError: SignInErrorInfo = {
        ...this.errorInfo,
        emailError: ValidationErrorCodes.INVALID_EMAIL,
      };

      this.setServerError(serverError);
    } else if (isWrongPassword || isUserNotFound) {
      const serverError: SignInErrorInfo = {
        ...this.errorInfo,
        passwordError: ValidationErrorCodes.INVALID_EMAIL_OR_PASSWORD,
      };

      this.setServerError(serverError);
    } else if (isUserDisabled) {
      const serverError: SignInErrorInfo = {
        ...this.errorInfo,
        emailError: ValidationErrorCodes.USER_IS_DISABLED,
      };

      this.setServerError(serverError);
    } else {
      errorHandler({error});
    }
  }
}

export default new SignInStore();
