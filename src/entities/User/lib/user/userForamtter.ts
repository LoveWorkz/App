import {AuthMethod, User} from '@src/entities/User';
import {AuthorisedUserByEmail, InitlUserInfo} from '@src/features/authByEmail';
import {AuthorisedUserByGoogle} from '@src/features/authByGmail';

export const userFormatter = (
  param: AuthorisedUserByEmail | AuthorisedUserByGoogle | InitlUserInfo,
  authMethod?: AuthMethod,
): User => {
  const formatedUser = {} as User;

  switch (authMethod) {
    case AuthMethod.AUTH_BY_GOOGLE:
      const {user: authorisedUserByGoogle} = param as AuthorisedUserByGoogle;
      formatedUser.email = authorisedUserByGoogle.email;
      formatedUser.id = authorisedUserByGoogle.id;
      formatedUser.name = authorisedUserByGoogle.name;
      formatedUser.photo = authorisedUserByGoogle.photo;
      formatedUser.emailVerified = true;
      break;
    case AuthMethod.AUTH_BY_EMAIL:
      const {user: authorisedUserByEmail} = param as AuthorisedUserByEmail;

      formatedUser.email = authorisedUserByEmail.email;
      formatedUser.id = authorisedUserByEmail.uid;
      formatedUser.name = authorisedUserByEmail.displayName;
      formatedUser.photo = authorisedUserByEmail.photoURL;
      formatedUser.emailVerified = authorisedUserByEmail.emailVerified;
      break;
    default:
      const initUserData = param as InitlUserInfo;

      formatedUser.email = initUserData.email;
      formatedUser.id = initUserData.uid;
      formatedUser.name = initUserData.displayName;
      formatedUser.photo = initUserData.photoURL;
      formatedUser.emailVerified = initUserData.emailVerified;
  }

  return formatedUser;
};
