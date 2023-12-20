import {DisplayText} from '@src/shared/types/types';

export interface GoalType {
  id: string;
  key: string;
  icon: string;
  name: DisplayText;
  goalNumber: number;
  isSelected: boolean;
}
