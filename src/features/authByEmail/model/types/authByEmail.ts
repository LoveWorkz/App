export interface InitlUserInfo {
  displayName: string | null;
  email: string;
  photoURL: null | string;
  uid: string;
  emailVerified: boolean;
}

export interface AuthorisedUserByEmail {
  user: InitlUserInfo;
}
