import {QuestionType} from '../types/questionTypes';

export const goodMoodQuestionCard: QuestionType = {
  categoryId: '',
  rubricId: '',
  type: 'ORDINARY_CARD',
  question: {
    de: 'de',
    en: 'en',
    pt: 'pt',
  },
  id: '',
  createdDate: '',
  difficulty: 0,
};

export const challengeCard: QuestionType = {
  categoryId: '',
  rubricId: '',
  type: 'CHALLENGE_CARD',
  question: {
    de: '',
    en: '',
    pt: '',
  },
  id: 'challenge_question',
  createdDate: '',
  difficulty: 1,
};
