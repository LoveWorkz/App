import {UserSpecialChallenge} from '@src/entities/UserChallengeCategory/model/types/userChallengeCategoryType';
import {DisplayText} from '@src/shared/types/types';

export interface ChallengeType {
  title: DisplayText;
  description: DisplayText;
  isChecked: boolean;
  rubrics: string[];
  id: string;
  nomer: string;
}

export interface SpecialChallengeType extends UserSpecialChallenge {
  title: DisplayText;
  description: DisplayText;
  rubrics: string[];
  id: string;
}
