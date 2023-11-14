import {CategoryKey} from '@src/entities/Category';
import {ChallengeCategoryType} from '../types/challengeCategory';

export const getNextChallengeCategory = (
  currentChallengeCategory: CategoryKey,
): CategoryKey => {
  switch (currentChallengeCategory) {
    case CategoryKey.Starter:
      return CategoryKey.Basic;
    case CategoryKey.Basic:
      return CategoryKey.Deep;
    case CategoryKey.Deep:
      return CategoryKey.Intimate;
    case CategoryKey.Intimate:
      return CategoryKey.Specials;
    default:
      return CategoryKey.Specials;
  }
};

export const challengeCategoryExample: ChallengeCategoryType = {
  id: '',
  image: '',
  name: CategoryKey.Starter,
  isBlocked: true,
  isActive: true,
  nomer: 0,
  displayName: {
    en: '',
    de: '',
    pt: '',
  },
};
