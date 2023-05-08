import {CategoryName} from '@src/entities/Category';
import {
  BasicDarkImage,
  BasicImage,
  DeepDarkImage,
  DeepImage,
  HotDarkImage,
  HotImage,
  IntimateDarkImage,
  IntimateImage,
  StarterDarkImage,
  StarterImage,
} from '@src/shared/assets/images';

export const getProgressBarImage = ({
  category,
  isDarkMode,
}: {
  category: CategoryName;
  isDarkMode: boolean;
}) => {
  switch (category) {
    case 'Starter':
      return isDarkMode ? StarterDarkImage : StarterImage;
    case 'Basic':
      return isDarkMode ? BasicDarkImage : BasicImage;
    case 'Deep':
      return isDarkMode ? DeepDarkImage : DeepImage;
    case 'Intimate':
      return isDarkMode ? IntimateDarkImage : IntimateImage;
    default:
      return isDarkMode ? HotDarkImage : HotImage;
  }
};
