export interface User {
  id: string;
  photo: string | null;
  email: string;
  name: string | null;
  emailVerified: boolean;
  isAuth: boolean;
}

export enum AuthMethod {
  AUTH_BY_GOOGLE = 'google',
  AUTH_BY_EMAIL = 'email',
}

export interface InitlUserInfo {
  displayName: string | null;
  email: string;
  photoURL: null | string;
  uid: string;
  emailVerified: boolean;
}

export interface AuthUserInfo {
  user: User | null;
  authMethod: AuthMethod | string;
}
