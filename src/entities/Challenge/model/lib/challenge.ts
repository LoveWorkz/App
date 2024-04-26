import {ChallengeGroupType} from '@src/entities/ChallengeGroup';
import {infoTextType} from '@src/widgets/InformationBlock';
import {TFunction} from 'i18next';
import {ChallengeType, SpecialChallengeType} from '../types/ChallengeTypes';

export const getChallengesLockedPopupContent = (t: TFunction) => {
  return {
    title: t('challenge.lockedPopupTitle'),
    text: t('challenge.lockedPopupText'),
  };
};

export const getChallengeGroupsFromUnlockedCategories = (
  coreChallengeGroups: ChallengeGroupType<
    ChallengeType[] | SpecialChallengeType[]
  >[],
  challengeCategoryIds: string[],
) => {
  return coreChallengeGroups.filter(group => {
    return group.challengeCategoryIds.some(id =>
      challengeCategoryIds.includes(id),
    );
  });
};

export const getActiveChallengesCount = (
  list: ChallengeType[] | SpecialChallengeType[],
  isCore: boolean,
) => {
  if (isCore) {
    const challenges = list as ChallengeType[];
    return challenges.filter(item => item.isChecked).length;
  } else {
    const challenges = list as SpecialChallengeType[];
    return challenges.filter(item => item.isSelected).length;
  }
};

export const challengeInfoPopupList: infoTextType[] = [
  {
    text: 'Remember, the most beautiful and effective “Thank you” is a sincere one. Personalising these gratitude expressions to align with your unique relationship will make them all the more meaningful.',
  },
  {
    text: 'Expressing gratitude should not be limited to just this challenge but should be integrated as a consistent element in your daily love life.',
  },
  {
    text: 'It can enhance empathy and reduce aggression & conflicts, helping couples to support each other even during difficult times. It Improves communication, increases positivity, encourages reciprocity and boosts satisfaction.',
  },
  {
    text: 'In essence, expressing gratitude is a fundamental part of maintaining a healthy, supportive, and loving relationship.',
  },
  {
    text: 'Regularly expressing gratitude reinforces the bond between partners & strengthens connection. It promotes feelings of warmth, safety, and reassurance that your partner values and appreciates you.',
  },
];
