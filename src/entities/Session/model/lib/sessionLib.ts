import {CategoryKey} from '@src/entities/Category';
import {
  basicSessionImage,
  deepSessionImage,
  intimateSessionImage,
  starterSessionImage,
} from '@src/shared/assets/images';

export const lastSessionNumber = 2;

export const getSessionsImages = (key: CategoryKey) => {
  switch (key) {
    case CategoryKey.Starter:
      return starterSessionImage;
    case CategoryKey.Basic:
      return basicSessionImage;
    case CategoryKey.Deep:
      return deepSessionImage;
    case CategoryKey.Intimate:
      return intimateSessionImage;
    default:
      return starterSessionImage;
  }
};
