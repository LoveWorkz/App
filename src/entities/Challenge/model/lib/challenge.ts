import {TFunction} from 'i18next';
import {ChallengeType, SpecialChallengeType} from '../types/ChallengeTypes';

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
