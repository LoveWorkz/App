import {TESTIMAGE} from '@src/shared/assets/images';
import {RatingInformationItemType} from '../types/completionTypes';

export const ratingInformationList: RatingInformationItemType[] = [
  {
    id: '1',
    pagekey: 'question_1',
    image: TESTIMAGE,
    pageNumber: 1,
    question: 'Did you find the questions relevant to your relationship?',
    prefix: 'Nope',
    postfix: 'Yes',
  },
  {
    id: '2',
    pagekey: 'question_2',
    image: TESTIMAGE,
    pageNumber: 2,
    question: 'How difficult would you rate the questions of this session?',
    prefix: 'Easy',
    postfix: 'Difficult',
  },
  {
    id: '3',
    pagekey: 'question_3',
    image: TESTIMAGE,
    pageNumber: 3,
    question: 'How much, do you think will this challenge help you in future?',
    prefix: 'Hated it',
    postfix: 'Awesome',
  },
  {
    id: '4',
    pagekey: 'question_4',
    image: TESTIMAGE,
    pageNumber: 4,
    question: 'How much did you enjoy this session?',
    prefix: 'hated it',
    postfix: 'awesome',
  },
  {
    id: '5',
    pagekey: 'feedback',
    image: TESTIMAGE,
  },
];
