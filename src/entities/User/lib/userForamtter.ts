import {CategoryKey} from '@src/entities/Category';
import {ChallengeCategoryKeys} from '@src/entities/ChallengeCategory';
import {User, InitlUserInfo} from '../model/types/userSchema';

export const userFormatter = (userInfo: InitlUserInfo): User => {
  const formatedUser = {} as User;

  formatedUser.email = userInfo.email;
  formatedUser.id = userInfo.uid;
  formatedUser.name = userInfo.displayName || '';
  formatedUser.emailVerified = userInfo.emailVerified;
  formatedUser.photo = userInfo.photoURL || '';
  formatedUser.age = 0;
  formatedUser.country = '';
  formatedUser.relationshipStatus = '';
  formatedUser.preferences = [];
  formatedUser.category = {
    currentCategory: CategoryKey.Starter,
  };
  formatedUser.challengeCategory = {
    currentChallengeCategory: ChallengeCategoryKeys.Bronze,
    currentChallengeCategoryId: '',
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
  formatedUser.hasUserSwipedAnyQuestion = false;

  formatedUser.partner = {
    name: '',
    email: '',
    age: 0,
  };

  return formatedUser;
};
