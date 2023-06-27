import {ChallengeType} from '../types/ChallengeTypes';

export const challengeFilterItems = [
  {
    name: 'Routine',
    active: false,
  },
  {
    name: 'Activity',
    active: false,
  },
  {
    name: 'Self-reflection',
    active: false,
  },
  {
    name: 'Game',
    active: false,
  },
  {
    name: 'Communication',
    active: false,
  },
];

export const challengeExample: ChallengeType = {
  title: {
    en: '',
    de: '',
    pt: '',
  },
  description: {
    en: '',
    de: '',
    pt: '',
  },
  isChecked: true,
  rubrics: [],
  id: '',
  nomer: '',
};
