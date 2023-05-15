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
  formatedUser.preferences = [];
  formatedUser.category = {
    currentCategory: 'Starter',
    currentCategoryId: '',
  };
  formatedUser.challengeCategory = {
    currentChallengeCategory: 'Bronze',
    currentChallengeCategoryId: 'challenge_category_1',
  };
  formatedUser.favorites = {
    currentQuestion: '',
    questions: [],
  };
  formatedUser.quote = {
    bookId: '',
    isQuoteVisible: true,
    quoteCheckingDate: '',
  };
  formatedUser.isWowThatWasFastModalForbidden = false;

  return formatedUser;
};
