export interface AuthorisedUserByGoogle {
  user: {
    idToken: string;
    email: string;
    name: string;
    scopes: string[];
    photo: null | string;
    id: string;
    emailVerified: boolean;
  };
}
