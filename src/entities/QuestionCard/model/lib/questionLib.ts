import {QuestionCardTypes, QuestionType} from '../types/questionTypes';

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
  rubric: null,
  category: null,
};

export const emptyCard: QuestionType = {
  categoryId: '',
  rubricId: '',
  type: 'EMPTY_CARD',
  question: {
    de: '',
    en: '',
    pt: '',
  },
  id: 'empty_card',
  createdDate: '',
  difficulty: 1,
  rubric: null,
  category: null,
};

export const isFunFact = (value?: string) => {
  if (!value) {
    return false;
  }
  return value.toLowerCase() === 'fun_fact';
};

export const isHotStuff = (value?: string) => {
  if (!value) {
    return false;
  }
  return value.toLowerCase() === 'hot_stuff';
};

export const isCardTypeWild = (type: QuestionCardTypes) => {
  return type === 'WILD_CARD';
};

export const isCardTypeOrdinary = (type: QuestionCardTypes) => {
  return type === 'ORDINARY_CARD';
};

export const isCardTypeEmpty = (type: QuestionCardTypes) => {
  return type === 'EMPTY_CARD';
};
