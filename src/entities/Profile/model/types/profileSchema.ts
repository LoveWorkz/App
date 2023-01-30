export interface Profile {
  id: string;
  photo: string | null;
  email: string;
  name: string | null;
  emailVerified: boolean;
  isAuth: boolean;
}
