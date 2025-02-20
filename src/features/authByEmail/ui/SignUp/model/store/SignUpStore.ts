import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';

import {AuthMethod, userFormatter, userStore} from '@src/entities/User';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {ValidationErrorCodes} from '@src/shared/types/validation';
import {FirebaseErrorCodes} from '@src/shared/types/firebase';
import {InitlUserInfo} from '@src/entities/User';
import {errorHandler} from '@src/shared/lib/errorHandler/errorHandler';
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
  isLoading: boolean = false;

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

  setIsloading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  resetForm() {
    this.setEmail('');
    this.setPassword('');
    this.setConfirmPassword('');
    this.setAgreeWithPrivacyPolicy(false);
    this.clearErrors();
  }

  setUser = async (user: InitlUserInfo | null) => {
    try {
      if (!user) {
        return;
      }
      const formattedUser = userFormatter(user);

      userStore.setAuthUserInfo({
        userId: formattedUser.id,
        authMethod: AuthMethod.AUTH_BY_EMAIL,
      });

      await userStore.addUserToFirestore(formattedUser);
      await userStore.checkAndSetUserVisitStatus({isSignUp: true});
    } catch (e) {
      errorHandler({error: e});
    }
  };

  register = async (actionAfterRegistration: () => void) => {
    try {
      crashlytics().log('User tried to register with Email.');
      const isOffline = await userStore.checkIfUserOfflineAndShowMessage();
      if (isOffline) {
        return;
      }

      this.clearErrors();

      const {isError, errorInfo} = validateFields({
        isSignUp: true,
        authData: this.signUpData,
      });

      if (isError) {
        this.setValidationError(errorInfo as SignUpErrorInfo);
        return;
      }

      this.setIsloading(true);

      await auth().createUserWithEmailAndPassword(
        this.signUpData.email,
        this.signUpData.password,
      );
      await auth().currentUser?.sendEmailVerification();

      crashlytics().log('User register with Email.');

      const currentUser = auth().currentUser;
      await this.setUser(currentUser as InitlUserInfo);

      actionAfterRegistration?.();

      this.setIsloading(false);
      navigation.replace(AppRouteNames.SETUP);
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
    const isEmailAlreadyInUse = error.message.includes(
      FirebaseErrorCodes.AUTH_EMAIL_ALREADY_IN_USE,
    );

    if (isEmailAlreadyInUse) {
      const serverError: SignUpErrorInfo = {
        ...this.errorInfo,
        emailError: ValidationErrorCodes.EMAIL_ALREADY_IN_USE,
      };

      this.setServerError(serverError);
    } else if (isInvalidEmail) {
      const serverError: SignUpErrorInfo = {
        ...this.errorInfo,
        emailError: ValidationErrorCodes.INVALID_EMAIL,
      };

      this.setServerError(serverError);
    } else {
      errorHandler({error});
    }
  }
}

export default new SignUpStore();
