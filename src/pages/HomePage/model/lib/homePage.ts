import {CategoryKey} from '@src/entities/Category';
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
  category: CategoryKey;
  isDarkMode: boolean;
}) => {
  switch (category) {
    case CategoryKey.Starter:
      return isDarkMode ? StarterDarkImage : StarterImage;
    case CategoryKey.Basic:
      return isDarkMode ? BasicDarkImage : BasicImage;
    case CategoryKey.Deep:
      return isDarkMode ? DeepDarkImage : DeepImage;
    case CategoryKey.Intimate:
      return isDarkMode ? IntimateDarkImage : IntimateImage;
    default:
      return isDarkMode ? HotDarkImage : HotImage;
  }
};
