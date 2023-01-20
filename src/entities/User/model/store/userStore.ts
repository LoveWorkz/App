import {action, makeAutoObservable} from 'mobx';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export class User {
  authUser: null | any = null;
  error: string = '';
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  async intiAuthUser() {
    const getCurrentUser = async () => {
      this.isLoading = true;
      const currentUser = await GoogleSignin.getCurrentUser();
      return currentUser;
    };

    getCurrentUser().then(
      action('fetchSuccess', user => {
        this.authUser = user;
        this.isLoading = false;
      }),
      action('fetchError', () => {
        this.error = 'error';
        this.isLoading = false;
      }),
    );
  }

  setAuthUser(user: any) {
    this.authUser = user;
  }
}
