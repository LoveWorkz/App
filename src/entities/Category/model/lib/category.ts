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
  isCategoryDetailsVisible: true,
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
