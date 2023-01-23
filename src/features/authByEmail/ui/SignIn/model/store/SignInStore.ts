import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';

import {AuthMethod, userFormatter, userStore} from '@src/entities/User';
import {AppRouteNames} from '@src/shared/config/configRoute';
import {navigate} from '@src/shared/config/navigation/navigation';
import {authStorage} from '@src/shared/lib/storage/adapters/authAdapter';
import {AUTH_METHOD_STORAGE_KEY} from '@src/shared/consts/storage';
import {AuthorisedUserByEmail} from '@src/features/authByEmail/model/types/authByEmail';
import {SignInData} from '../types/signIn';
import {validateSignInFields} from '../services/validation/validateFields';

class SignInStore {
  signInData: SignInData = {
    email: '',
    password: '',
    error: '',
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

  singIn() {
    if (validateSignInFields(this.signInData)) {
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
        console.log('signed in!');
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

export default new SignInStore();
