import {CategoryKey} from '@src/entities/Category';
import {
  // Basic
  BasicDarkImage,
  BasicDarkImage_30,
  BasicDarkImage_60,
  BasicDarkImage_90,
  BasicImage,
  BasicImage_30,
  BasicImage_60,
  BasicImage_90,
  // Deep
  DeepDarkImage,
  DeepDarkImage_30,
  DeepDarkImage_60,
  DeepDarkImage_90,
  DeepImage,
  DeepImage_30,
  DeepImage_60,
  DeepImage_90,
  // Starter
  StarterDarkImage,
  StarterDarkImage_30,
  StarterDarkImage_60,
  StarterDarkImage_90,
  StarterImage,
  StarterImage_30,
  StarterImage_60,
  StarterImage_90,
  // Intimate
  IntimateImage,
  IntimateDarkImage,
} from '@src/shared/assets/images';

const imageGroupMapping: Record<string, Record<string, number[]>> = {
  [CategoryKey.Starter]: {
    light: [StarterImage, StarterImage_30, StarterImage_60, StarterImage_90],
    dark: [
      StarterDarkImage,
      StarterDarkImage_30,
      StarterDarkImage_60,
      StarterDarkImage_90,
    ],
  },
  [CategoryKey.Basic]: {
    light: [BasicImage, BasicImage_30, BasicImage_60, BasicImage_90],
    dark: [
      BasicDarkImage,
      BasicDarkImage_30,
      BasicDarkImage_60,
      BasicDarkImage_90,
    ],
  },
  [CategoryKey.Deep]: {
    light: [DeepImage, DeepImage_30, DeepImage_60, DeepImage_90],
    dark: [DeepDarkImage, DeepDarkImage_30, DeepDarkImage_60, DeepDarkImage_90],
  },
  [CategoryKey.Intimate]: {
    light: [IntimateImage, IntimateImage, IntimateImage, IntimateImage],
    dark: [
      IntimateDarkImage,
      IntimateDarkImage,
      IntimateDarkImage,
      IntimateDarkImage,
    ],
  },
};

export const getProgressBarImageGroups = ({
  category,
  isDarkMode,
}: {
  category: CategoryKey;
  isDarkMode: boolean;
}) => {
  // Use the mapping to get the correct image group based on the category and theme mode
  const categoryImages =
    imageGroupMapping[category] || imageGroupMapping[CategoryKey.Intimate];
  return isDarkMode ? categoryImages.dark : categoryImages.light;
};
