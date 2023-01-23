import {SignInData} from '../../types/signIn';

export const validateSignInFields = (signUpData: SignInData) => {
  let isError = false;

  const {email, password} = signUpData;

  if (!email || !password) {
    isError = true;
    return isError;
  }

  return isError;
};
