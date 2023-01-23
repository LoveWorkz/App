import signUpStore from '../../store/SignUpStore';
import {SignUpData} from '../../types/signUp';

export const validateSignUpFields = (signUpData: SignUpData) => {
  let isError = false;

  const {confirmPassword, email, password} = signUpData;

  if (!email || !password || !confirmPassword) {
    isError = true;
    return isError;
  }

  if (password !== confirmPassword) {
    isError = true;
    signUpStore.setConfirmPasswordError('confirm_password_error');
  } else {
    isError = false;
    signUpStore.setConfirmPasswordError('');
  }

  return isError;
};
