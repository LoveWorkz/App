import {DisplayText} from '@src/shared/types/types';

export interface ChallengeType {
  title: DisplayText;
  description: DisplayText;
  isChecked: boolean;
  rubrics: string[];
  id: string;
  nomer: string;
}
