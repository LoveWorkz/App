import {CategoryKey} from '@src/entities/Category';
import {
  basicSessionImage,
  deepSessionImage,
  intimateSessionImage,
  starterSessionImage,
} from '@src/shared/assets/images';

export const sessionsCountWithSubscription = 12;
export const sessionsCountWithoutSubscription = 4;

export const getSessionsImages = (key: CategoryKey) => {
  switch (key) {
    case CategoryKey.Starter:
      return starterSessionImage;
    case CategoryKey.Basic:
      return basicSessionImage;
    case CategoryKey.Deep:
      return deepSessionImage;
    case CategoryKey.Intimate:
      return intimateSessionImage;
    default:
      return starterSessionImage;
  }
};

export const userSession = {
  breakPointForCheckingDate: 30,
  currentQuestion: '',
  isAllQuestionsSwiped: false,
  isBlocked: true,
  questionSwipeStartDate: '',
  swipedQuestionsPercentage: 0,
  isMarked: false,
};

export const SESSION_INTERVAL_FOR_RATE_PROMPT = 3;
