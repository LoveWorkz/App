export interface User {
  id: string;
  photo: string | null;
  email: string;
  name: string | null;
  emailVerified: boolean;
}

export enum AuthMethod {
  AUTH_BY_GOOGLE = 'google',
  AUTH_BY_EMAIL = 'email',
}
