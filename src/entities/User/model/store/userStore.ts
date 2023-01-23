import {makeAutoObservable} from 'mobx';

import {User} from '../types/userSchema';

export class UserStore {
  authUser: null | User = null;
  error: string = '';
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAuthUser(user: User | null) {
    this.authUser = user;
  }
}
