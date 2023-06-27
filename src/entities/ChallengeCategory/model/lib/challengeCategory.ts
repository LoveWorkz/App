import {
  ChallengeCategoryKeys,
  ChallengeCategoryType,
} from '../types/challengeCategory';

export const getNextChallengeCategory = (
  currentChallengeCategory: ChallengeCategoryKeys,
): ChallengeCategoryKeys => {
  switch (currentChallengeCategory) {
    case ChallengeCategoryKeys.Bronze:
      return ChallengeCategoryKeys.Silver;
    case ChallengeCategoryKeys.Silver:
      return ChallengeCategoryKeys.Gold;
    case ChallengeCategoryKeys.Gold:
      return ChallengeCategoryKeys.Diamond;
    case ChallengeCategoryKeys.Diamond:
      return ChallengeCategoryKeys.Platinum;
    default:
      return ChallengeCategoryKeys.Platinum;
  }
};

export const challengeCategoryExample: ChallengeCategoryType = {
  id: '',
  image: '',
  name: ChallengeCategoryKeys.Bronze,
  isBlocked: true,
  isActive: true,
  nomer: 0,
  displayName: {
    en: '',
    de: '',
    pt: '',
  },
};
