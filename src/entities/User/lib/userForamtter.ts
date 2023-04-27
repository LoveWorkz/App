import {User, InitlUserInfo} from '../model/types/userSchema';

export const userFormatter = (userInfo: InitlUserInfo): User => {
  const formatedUser = {} as User;

  formatedUser.email = userInfo.email;
  formatedUser.id = userInfo.uid;
  formatedUser.name = userInfo.displayName;
  formatedUser.emailVerified = userInfo.emailVerified;
  formatedUser.photo = userInfo.photoURL;
  formatedUser.age = 0;
  formatedUser.country = '';
  formatedUser.relationshipStatus = '';
  formatedUser.rubric = '';
  formatedUser.category = {
    currentCategory: '',
    currentCategoryId: '',
  };
  formatedUser.challengeCategory = {
    currentChallengeCategory: '',
    currentChallengeCategoryId: '',
  };
  formatedUser.favorites = {
    currentQuestion: '',
    questions: [],
  };

  formatedUser.language = 'en';

  return formatedUser;
};
