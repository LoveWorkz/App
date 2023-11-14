import {TFunction} from 'i18next';
import {ChallengeType, SpecialChallengeType} from '../types/ChallengeTypes';

export const challengeFilterItems = [
  {
    name: 'Exercise',
    active: false,
  },
  {
    name: 'Activity',
    active: false,
  },
  {
    name: 'Routine',
    active: false,
  },
  {
    name: 'Self-reflection',
    active: false,
  },
  {
    name: 'Dreams',
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
  isChallengeSpecial: false,
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
  isChallengeSpecial: true,
};

export const getChallengesLockedPopupContent = (t: TFunction) => {
  return {
    title: t('challenge.lockedPopupTitle'),
    text: t('challenge.lockedPopupText'),
  };
};
