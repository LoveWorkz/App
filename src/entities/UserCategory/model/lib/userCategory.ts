import {CategoryType} from '@src/entities/Category';

export const userCategoryInitData: Partial<CategoryType> = {
  isBlocked: false,
  isCategoryDetailsVisible: true,
  isAllSessionsPassed: false,
  sessions: {
    session_1: {
      breakPointForCheckingDate: 30,
      currentQuestion: '',
      isAllQuestionsSwiped: false,
      isBlocked: false,
      questionSwipeStartDate: '',
      swipedQuestionsPercentage: 0,
      isMarked: false,
    },
    session_2: {
      breakPointForCheckingDate: 30,
      currentQuestion: '',
      isAllQuestionsSwiped: false,
      isBlocked: false,
      questionSwipeStartDate: '',
      swipedQuestionsPercentage: 0,
      isMarked: false,
    },
  },
};
