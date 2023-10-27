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
  description: '',
  questions: [],
  categorySize: 'large',
  isCategoryDetailsVisible: true,
  isAllSessionsPassed: false,
  createdDate: '',
  displayName: {
    en: '',
    de: '',
    pt: '',
  },
  sessions: {},
};
