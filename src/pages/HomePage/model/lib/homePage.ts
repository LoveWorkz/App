import {CategoryKey} from '@src/entities/Category';
import {QuadrantKey} from '@src/entities/Session';
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
  IntimateImage_30,
  IntimateImage_60,
  IntimateImage_90,
  IntimateDarkImage,
} from '@src/shared/assets/images';

const lightImageGroupMapping: Record<string, Record<QuadrantKey, number>> = {
  [CategoryKey.Starter]: {
    personal_growth: StarterImage,
    friendship: StarterImage_30,
    communication_conflictm: StarterImage_60,
    shared_meaning: StarterImage_90,
  },
  [CategoryKey.Basic]: {
    personal_growth: BasicImage,
    friendship: BasicImage_30,
    communication_conflictm: BasicImage_60,
    shared_meaning: BasicImage_90,
  },
  [CategoryKey.Deep]: {
    personal_growth: DeepImage,
    friendship: DeepImage_30,
    communication_conflictm: DeepImage_60,
    shared_meaning: DeepImage_90,
  },
  [CategoryKey.Intimate]: {
    personal_growth: IntimateImage,
    friendship: IntimateImage_30,
    communication_conflictm: IntimateImage_60,
    shared_meaning: IntimateImage_90,
  },
};

const darkImageGroupMapping: Record<string, Record<QuadrantKey, number>> = {
  [CategoryKey.Starter]: {
    personal_growth: StarterDarkImage,
    friendship: StarterDarkImage_30,
    communication_conflictm: StarterDarkImage_60,
    shared_meaning: StarterDarkImage_90,
  },
  [CategoryKey.Basic]: {
    personal_growth: BasicDarkImage,
    friendship: BasicDarkImage_30,
    communication_conflictm: BasicDarkImage_60,
    shared_meaning: BasicDarkImage_90,
  },
  [CategoryKey.Deep]: {
    personal_growth: DeepDarkImage,
    friendship: DeepDarkImage_30,
    communication_conflictm: DeepDarkImage_60,
    shared_meaning: DeepDarkImage_90,
  },
  [CategoryKey.Intimate]: {
    personal_growth: IntimateDarkImage,
    friendship: IntimateDarkImage,
    communication_conflictm: IntimateDarkImage,
    shared_meaning: IntimateDarkImage,
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
  return isDarkMode
    ? darkImageGroupMapping[category]
    : lightImageGroupMapping[category];
};
