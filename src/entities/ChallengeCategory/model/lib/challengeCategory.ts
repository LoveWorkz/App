import {CategoryKey} from '@src/entities/Category';
import {ChallengeCategoryType} from '../types/challengeCategory';

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
