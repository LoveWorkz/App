import {CategoryName} from '@src/entities/Category';
import {BasicDarkIcon} from '@src/shared/assets/icons/categories/dark/BasicDark';
import {DeepDarkIcon} from '@src/shared/assets/icons/categories/dark/DeepDark';
import {HotDarkIcon} from '@src/shared/assets/icons/categories/dark/HotDark';
import {IntimateDarkIcon} from '@src/shared/assets/icons/categories/dark/IntimateDark';
import {StarterDarkIcon} from '@src/shared/assets/icons/categories/dark/StarterDark';
import {BasicIcon} from '@src/shared/assets/icons/categories/light/Basic';
import {DeepIcon} from '@src/shared/assets/icons/categories/light/Deep';
import {HotIcon} from '@src/shared/assets/icons/categories/light/Hot';
import {IntimateIcon} from '@src/shared/assets/icons/categories/light/Intimate';
import {StarterIcon} from '@src/shared/assets/icons/categories/light/Starter';

export const getProgressBarIcon = ({
  category,
  isDarkMode,
}: {
  category: CategoryName;
  isDarkMode: boolean;
}) => {
  switch (category) {
    case 'Starter':
      return isDarkMode ? StarterDarkIcon : StarterIcon;
    case 'Basic':
      return isDarkMode ? BasicDarkIcon : BasicIcon;
    case 'Deep':
      return isDarkMode ? DeepDarkIcon : DeepIcon;
    case 'Intimate':
      return isDarkMode ? IntimateDarkIcon : IntimateIcon;
    default:
      return isDarkMode ? HotDarkIcon : HotIcon;
  }
};
