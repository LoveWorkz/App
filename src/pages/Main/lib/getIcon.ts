import {HomeIcon} from '@src/shared/assets/icons/Home';
import {BooksIcon} from '@src/shared/assets/icons/Books';
import {CategoriesIcon} from '@src/shared/assets/icons/Categories';
import {ChallengesIcon} from '@src/shared/assets/icons/Challenges';
import {ShopIcon} from '@src/shared/assets/icons/Shop';
import {AppRouteNames} from '@src/shared/config/route/configRoute';

export const getIcon = (routName: string): string => {
  let icon;

  switch (routName) {
    case AppRouteNames.CATEGORIES:
      icon = CategoriesIcon;
      break;
    case AppRouteNames.BOOKS:
      icon = BooksIcon;
      break;
    case AppRouteNames.CHALLENGES:
      icon = ChallengesIcon;
      break;
    case AppRouteNames.SHOP:
      icon = ShopIcon;
      break;
    default:
      icon = HomeIcon;
  }

  return icon;
};
