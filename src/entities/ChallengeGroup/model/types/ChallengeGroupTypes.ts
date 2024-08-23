import {DisplayText} from '@src/shared/types/types';

export interface ChallengeGroupType<C> {
  challenges: C;
  challengeCategoryIds: string[];
  createdDate: 'string';
  description: DisplayText;
  displayName: DisplayText;
  id: string;
  key: string;
  largeDescription?: DisplayText;
  title?: DisplayText;
  image_name: string;
}
