import {ChallengeGroupType} from '@src/entities/ChallengeGroup';
import {TFunction} from 'i18next';
import {ChallengeType, SpecialChallengeType} from '../types/ChallengeTypes';

export const getChallengesLockedPopupContent = (t: TFunction) => {
  return {
    title: t('challenge.lockedPopupTitle'),
    text: t('challenge.lockedPopupText'),
  };
};

export const getChallengeGroupsFromUnlockedCategories = (
  coreChallengeGroups: ChallengeGroupType<ChallengeType[] | SpecialChallengeType[]>[],
  challengeCategoryIds: string[],
) => {
  return coreChallengeGroups.filter(group => {
    return group.challengeCategoryIds.some(id =>
      challengeCategoryIds.includes(id),
    );
  });
};
