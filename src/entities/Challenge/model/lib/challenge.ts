import {TFunction} from 'i18next';

import {ChallengeGroupType} from '@src/entities/ChallengeGroup';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import {challengeInfoStorage} from '@src/shared/lib/storage/adapters/challengeInforAdapter';
import {SPECIAL_CHALLENGE_BUTTON_STATUS_KEY} from '@src/shared/consts/storage';
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

export const getChallengeInfoPopupContent = ({
  specialChallenge,
  language,
}: {
  specialChallenge: SpecialChallengeType | null;
  language: LanguageValueType;
}) => {
  return specialChallenge
    ? specialChallenge.popupContent.map(item => ({text: item[language]}))
    : [];
};

// Helper to fetch and parse the challenge button status
export const fetchChallengeButtonStatus = async (): Promise<any> => {
  const statusRaw = await challengeInfoStorage.getChallengeInfo(
    SPECIAL_CHALLENGE_BUTTON_STATUS_KEY,
  );
  return statusRaw ? JSON.parse(statusRaw) : {};
};

// Function to determine if the current card is the last card
export const isLastCard = (cardId: string, cards: any[]): boolean => {
  const lastCard = cards[cards.length - 1];
  return cardId === lastCard.cardId;
};
