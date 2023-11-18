import {UserSpecialChallenge} from '@src/entities/UserChallengeCategory/model/types/userChallengeCategoryType';
import {DisplayText} from '@src/shared/types/types';

export interface ChallengeType {
  title: DisplayText;
  description: DisplayText;
  isChecked: boolean;
  rubrics: string[];
  id: string;
  nomer: string;
  isChallengeSpecial: boolean;
}

export interface SpecialChallengeType extends UserSpecialChallenge {
  title: DisplayText;
  description: DisplayText;
  multiDescription: {
    part1: DisplayText;
    part2: DisplayText;
    part3: DisplayText;
  };
  rubrics: string[];
  id: string;
  isChallengeSpecial: boolean;
  specialChallengeType: string;
  challengeCardsData: any[];
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
