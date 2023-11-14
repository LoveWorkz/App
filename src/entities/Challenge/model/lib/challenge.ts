import {TFunction} from 'i18next';
import {ChallengeType, SpecialChallengeType} from '../types/ChallengeTypes';

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

export const specialChallengeExample: SpecialChallengeType = {
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
  isSelected: true,
  rubrics: [],
  id: '',
  isBlocked: true,
};

export const getChallengesLockedPopupContent = (t: TFunction) => {
  return {
    title: t('challenge.lockedPopupTitle'),
    text: t('challenge.lockedPopupText'),
  };
};
