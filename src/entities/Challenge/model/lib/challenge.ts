import {TFunction} from 'i18next';
import {ChallengeType, SpecialChallengeType} from '../types/ChallengeTypes';

export const challengeFilterItems = [
  {
    name: 'exercise',
    active: false,
  },
  {
    name: 'activity',
    active: false,
  },
  {
    name: 'routine',
    active: false,
  },
  {
    name: 'self_reflection',
    active: false,
  },
  {
    name: 'dreams',
    active: false,
  },
  {
    name: 'friendship',
    active: false,
  },
  {
    name: 'personal_growth',
    active: false,
  },
  {
    name: 'conflict_management',
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

export const specialChallengeExample: Partial<SpecialChallengeType> = {
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
  challengeCardsData: [],
  specialChallengeType: '',
};

export const getChallengesLockedPopupContent = (t: TFunction) => {
  return {
    title: t('challenge.lockedPopupTitle'),
    text: t('challenge.lockedPopupText'),
  };
};
