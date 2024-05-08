import {CategoryKey, CategoryType} from '../types/categoryTypes';

export const categoryExample: CategoryType = {
  name: CategoryKey.Basic,
  id: '',
  image: {
    small: '',
    large: '',
    middle: '',
  },
  leftSide: true,
  isBlocked: false,
  description: {
    en: '',
    de: '',
    pt: '',
  },
  categorySize: 'large',
  currentSession: '',
  createdDate: '',
  displayName: {
    en: '',
    de: '',
    pt: '',
  },
  sessions: {},
  ratePopUpBreakpoint: 3,
  currentSessionNumber: 1,
  challengeCategoryId: '',
  quadrants: {},
};

export const FIRST_LEVEL_ID = 'level_1';

export const getLevelsFinalImageUrls = (): Record<CategoryKey, string> => {
  return {
    [CategoryKey.Starter]:
      'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/categories%2FStarter%2FStarter_Final.png?alt=media&token=8075b27b-c0db-4244-98ad-ffa187c90f3f',
    [CategoryKey.Basic]:
      'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/categories%2FBasic%2FBasic_Final.png?alt=media&token=7e15816f-c3de-4b48-9096-685854a02dc6',
    [CategoryKey.Deep]:
      'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/categories%2FDeep%2FDeep_Final.png?alt=media&token=4ab3e3ba-2b91-471d-9861-e669e3957e9d',
    [CategoryKey.Intimate]:
      'https://firebasestorage.googleapis.com/v0/b/love-is-not-enough.appspot.com/o/categories%2FIntimate%2FIntimate_Final.png?alt=media&token=27616747-c226-459e-bfea-e4bc6e308750',
    [CategoryKey.Specials]: '',
    [CategoryKey.How_To_Use]: '',
  };
};
