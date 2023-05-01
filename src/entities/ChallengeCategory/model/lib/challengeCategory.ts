import {ChallengeCategoriesNames} from '../types/challengeCategory';

export const getNextChallengeCategory = (
  currentChallengeCategory: ChallengeCategoriesNames,
): ChallengeCategoriesNames => {
  switch (currentChallengeCategory) {
    case 'Bronze':
      return 'Silver';
    case 'Silver':
      return 'Gold';
    case 'Gold':
      return 'Diamond';
    case 'Diamond':
      return 'Platinum';
    default:
      return 'Platinum';
  }
};
