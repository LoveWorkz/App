export interface InitlUserInfo {
  displayName: string | null;
  email: string;
  photoURL: null | string;
  uid: string;
}

export interface AuthorisedUserByEmail {
  user: InitlUserInfo;
}
