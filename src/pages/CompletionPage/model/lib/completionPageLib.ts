import { ordinalSuffixOf } from '@src/shared/lib/common';
import {RatingInformationItemType} from '../types/completionTypes';

export const keyWords = ['SESSION?', 'LEVEL?', 'QUADRANT?'];

export const sessionRatingList: RatingInformationItemType[] = [
  {
    id: '1',
    pagekey: 'question_1',
    image: '',
    pageNumber: 1,
    question: 'Did you find the questions relevant to your relationship?',
    styledWords: ['questions'],
    prefix: 'Nope',
    postfix: 'Yes',
  },
  {
    id: '2',
    pagekey: 'question_2',
    image: '',
    pageNumber: 2,
    question: 'How difficult would you rate the questions of this session?',
    styledWords: ['questions'],
    prefix: 'Easy',
    postfix: 'Difficult',
  },
  {
    id: '3',
    pagekey: 'question_3',
    image: '',
    pageNumber: 3,
    question: 'How much, do you think will this challenge help you in future?',
    styledWords: ['challenge'],
    prefix: 'Hated it',
    postfix: 'Awesome',
  },
  {
    id: '4',
    pagekey: 'question_4',
    image: '',
    pageNumber: 4,
    question: 'How much did you enjoy the whole SESSION?',
    styledWords: ['SESSION?'],
    prefix: 'hated it',
    postfix: 'awesome',
  },
  {
    id: '5',
    pagekey: 'feedback',
    image: '',
  },
];

export const levelRatingInformationList: RatingInformationItemType[] = [
  {
    id: '1',
    pagekey: 'question_1',
    image: '',
    pageNumber: 1,
    question: 'Did you find the questions relevant to your relationship?',
    styledWords: ['questions'],
    prefix: 'Nope',
    postfix: 'Yes',
  },
  {
    id: '2',
    pagekey: 'question_2',
    image: '',
    pageNumber: 2,
    question: 'How difficult would you rate the Questions of this session?',
    styledWords: ['questions'],
    prefix: 'Easy',
    postfix: 'Difficult',
  },
  {
    id: '3',
    pagekey: 'question_3',
    image: '',
    pageNumber: 3,
    question: 'How much, do you think will this Challenge help you in future?',
    styledWords: ['challenge'],
    prefix: 'not much',
    postfix: 'a lot',
  },
  {
    id: '4',
    pagekey: 'question_4',
    image: '',
    pageNumber: 4,
    question: 'How much did you enjoy the whole LEVEL?',
    styledWords: ['LEVEL?'],
    prefix: 'hated it',
    postfix: 'awesome',
  },
  {
    id: '5',
    pagekey: 'feedback',
    image: '',
  },
];

export const quadrantRatingInformationList: RatingInformationItemType[] = [
  {
    id: '1',
    pagekey: 'question_1',
    image: '',
    pageNumber: 1,
    question: 'Did you find the Questions relevant to your relationship?',
    styledWords: ['questions'],
    prefix: 'Nope',
    postfix: 'Yes',
  },
  {
    id: '2',
    pagekey: 'question_2',
    image: '',
    pageNumber: 2,
    question: 'How difficult would you rate the Questions of this session?',
    styledWords: ['questions'],
    prefix: 'Easy',
    postfix: 'Difficult',
  },
  {
    id: '3',
    pagekey: 'question_3',
    image: '',
    pageNumber: 3,
    question: 'How much, do you think will this Challenge help you in future?',
    styledWords: ['challenge'],
    prefix: 'not much',
    postfix: 'a lot',
  },
  {
    id: '4',
    pagekey: 'question_4',
    image: '',
    pageNumber: 4,
    question: 'How much did you enjoy the whole QUADRANT?',
    styledWords: ['QUADRANT?'],
    prefix: 'hated it',
    postfix: 'awesome',
  },
  {
    id: '5',
    pagekey: 'feedback',
    image: '',
    description: 'You can be proud of yourselfs.',
  },
];

export const getSessionDescription = ({
  currentLevelName,
  curreentSessionNumber,
  allSessionsCount,
}: {
  currentLevelName: string;
  allSessionsCount: number;
  curreentSessionNumber: number;
}) => {
  return `You’ve finished your ${ordinalSuffixOf(curreentSessionNumber)} session of ${allSessionsCount} sessions on the ${currentLevelName} level`;
};

export const getQuadrantDescription = (quadrantName: string) => {
  return `Now that you have successfully mastered all sessions of the ${quadrantName} area.`;
};

export const getLevelDescription = ({
  currentLevelName,
  nextLevelName,
}: {
  currentLevelName: string;
  nextLevelName?: string;
}) => {
  if (!nextLevelName) {
    return 'last description text';
  }

  return `You’ve finished ${currentLevelName} level.  Next Step -> ${nextLevelName} Level.`;
};
