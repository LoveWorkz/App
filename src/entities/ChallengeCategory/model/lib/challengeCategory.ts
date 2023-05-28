import {ChallengeCategoryKeys} from '../types/challengeCategory';

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
