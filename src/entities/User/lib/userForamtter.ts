import {CategoryKey} from '@src/entities/Category';
import {User, InitlUserInfo} from '../model/types/userSchema';

export const userFormatter = (userInfo: InitlUserInfo): User => {
  const formatedUser = {} as User;

  formatedUser.email = userInfo.email;
  formatedUser.id = userInfo.uid;
  formatedUser.name = userInfo.displayName || '';
  formatedUser.emailVerified = userInfo.emailVerified;
  formatedUser.photo = userInfo.photoURL || '';
  formatedUser.country = '';
  formatedUser.category = {
    currentCategory: CategoryKey.Starter,
  };
  formatedUser.challengeCategory = {
    currentChallengeCategory: CategoryKey.Starter,
    currentChallengeCategoryId: '',
  };
  formatedUser.quote = {
    bookId: '',
    isQuoteVisible: true,
    quoteCheckingDate: '',
  };
  formatedUser.isWowThatWasFastModalForbidden = false;

  formatedUser.hasUserRated = false;
  formatedUser.gender = '';
  formatedUser.selectedGoalsIds = [];
  formatedUser.birthDate = '';
  formatedUser.notification = {
    lastSessionDate: '',
    fcmToken: '',
  };

  return formatedUser;
};
