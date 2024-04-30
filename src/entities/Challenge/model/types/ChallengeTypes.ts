import {DisplayText} from '@src/shared/types/types';

export interface ChallengeType {
  title: DisplayText;
  description: DisplayText;
  isChecked: boolean;
  rubrics: string[];
  groupId: string;
  id: string;
  nomer: string;
  isChallengeSpecial: boolean;
}

export interface SpecialChallengeType {
  title: DisplayText;
  description: DisplayText[];
  background: DisplayText[];
  popupContent: DisplayText[];
  groupId: string;
  id: string;
  isChallengeSpecial: boolean;
  challengeCardsData: ChallengeCardType[];
  isChecked: boolean;
}

export interface ChallengeCardType {
  title: DisplayText;
  body: DisplayText;
  showButton: false;
  cardId: string;
}

export enum SpecialChallengeEnum {
  SELF_REFLECTION = 'selfReflection',
  VOCABULARY_OF_FEEL = 'vocabularyOfFeel',
  WALK_OF_GRATITUDE = 'walkOfGratitude',
  SELF_REFLECTION_MY_OWN_NEEDS = 'selfReflectionMyOwnNeeds',
  KNOW_EACH_OTHER_BETTER = 'knowEachOtherBetter',
  TEN_DAYS_CHALLENGE = 'tenDaysChallenge',
  EFFECTIVE_APOLOGIES = 'effectiveApologies',
  RAPID_CALMING = 'rapidCalming',
}
