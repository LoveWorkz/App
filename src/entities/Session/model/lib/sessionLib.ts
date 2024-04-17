import {CategoryKey} from '@src/entities/Category';
import {
  basicSessionImage,
  deepSessionImage,
  intimateSessionImage,
  starterSessionImage,
} from '@src/shared/assets/images';

export const sessionsCountWithSubscription = 6;
export const sessionsCountWithoutSubscription = 6;

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
};

export const SESSION_INTERVAL_FOR_RATE_PROMPT = 3;
export const FIRST_QUADRANT_ID = 'quadrant1';
