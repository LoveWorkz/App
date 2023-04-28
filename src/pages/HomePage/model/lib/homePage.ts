import {CategoryName} from '@src/entities/Category';
import {BasicIcon} from '@src/shared/assets/icons/categories/Basic';
import {DeepIcon} from '@src/shared/assets/icons/categories/Deep';
import {HotIcon} from '@src/shared/assets/icons/categories/Hot';
import {IntimateIcon} from '@src/shared/assets/icons/categories/Intimate';
import {StarterIcon} from '@src/shared/assets/icons/categories/Starter';

export const getProgressBarIcon = (category: CategoryName) => {
  switch (category) {
    case 'Starter':
      return StarterIcon;
    case 'Basic':
      return BasicIcon;
    case 'Deep':
      return DeepIcon;
    case 'Intimate':
      return IntimateIcon;
    default:
      return HotIcon;
  }
};
