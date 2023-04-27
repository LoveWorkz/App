import {ChallengeCategoriesNames} from '../types/challengeCategory';
import {TFunction} from 'i18next';

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

export const translateChallenge = ({
  t,
  name,
}: {
  t: TFunction;
  name: ChallengeCategoriesNames;
}) => {
  return t(`challenge.${name}`);
};
