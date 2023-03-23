import {HomeIcon} from '@src/shared/assets/icons/Home';
import {BooksIcon} from '@src/shared/assets/icons/Books';
import {CategoriesIcon} from '@src/shared/assets/icons/Categories';
import {ChallengesIcon} from '@src/shared/assets/icons/Challenges';
import {ShopIcon} from '@src/shared/assets/icons/Shop';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';

export const getIcon = (routName: string): string => {
  let icon;

  switch (routName) {
    case TabRoutesNames.CATEGORIES:
      icon = CategoriesIcon;
      break;
    case TabRoutesNames.BOOKS:
      icon = BooksIcon;
      break;
    case TabRoutesNames.CHALLENGES:
      icon = ChallengesIcon;
      break;
    case TabRoutesNames.SHOP:
      icon = ShopIcon;
      break;
    default:
      icon = HomeIcon;
  }

  return icon;
};
