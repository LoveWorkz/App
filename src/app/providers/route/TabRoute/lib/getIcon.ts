import {getHomeIcon} from '@src/shared/assets/icons/Home';
import {getBooksIcon} from '@src/shared/assets/icons/Books';
import {getCategoriesIcon} from '@src/shared/assets/icons/Categories';
import {getChallengesIcon} from '@src/shared/assets/icons/Challenges';
import {getShopIcon} from '@src/shared/assets/icons/Shop';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';

export const getTabIcon = (routName: string) => {
  let getIcon;

  switch (routName) {
    case TabRoutesNames.CATEGORIES:
      getIcon = getCategoriesIcon;
      break;
    case TabRoutesNames.BOOKS:
      getIcon = getBooksIcon;
      break;
    case TabRoutesNames.CHALLENGES:
      getIcon = getChallengesIcon;
      break;
    case TabRoutesNames.SHOP:
      getIcon = getShopIcon;
      break;
    default:
      getIcon = getHomeIcon;
  }

  return getIcon;
};
