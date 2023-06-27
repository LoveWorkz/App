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
  currentQuestion: '',
  swipedQuestionsPercentage: 0,
  questionSwipeStartDate: '',
  breakPointForCheckingDate: 0,
  isAllQuestionsSwiped: false,
  createdDate: '',
  displayName: {
    en: '',
    de: '',
    pt: '',
  },
};
