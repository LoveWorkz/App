import {CategoryKey} from '@src/entities/Category';
import {
  basicSessionImage,
  deepSessionImage,
  intimateSessionImage,
  starterSessionImage,
} from '@src/shared/assets/images';

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
  isBlocked: true,
  questionSwipeStartDate: '',
  swipedQuestionsPercentage: 0,
};

export const SESSION_INTERVAL_FOR_RATE_PROMPT = 3;
export const FIRST_QUADRANT_ID = 'quadrant1';

export enum EventEndType {
  SESSION_END = 'sessionEnd',
  LEVEL_END = 'levelEnd',
  QUADRANTS_END = 'quadrantEnd',
}

export const getQuadrantsImageUrls = (): Record<string, string> => {
  return {
    quadrant1:
      'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/quadrants%2FPersonal_Growth.png?alt=media&token=b65a139b-add6-412c-98aa-1821015d9795',
    quadrant2:
      'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/quadrants%2FFriendship.png?alt=media&token=b6c60f17-4648-4f19-b2a6-e2b0bbc07503',
    quadrant3:
      'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/quadrants%2FCommunicationConflict.png?alt=media&token=040cda4a-5157-4e6d-900c-d439dd61b426',
    quadrant4:
      'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/quadrants%2FSharedMeaning.png?alt=media&token=015e4c03-cf28-4b8e-b542-28254db95077',
  };
};
