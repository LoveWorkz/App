import {getBooksIcon} from '@src/shared/assets/icons/Books';
import {getCategoriesIcon} from '@src/shared/assets/icons/Categories';
import {getChallengesIcon} from '@src/shared/assets/icons/Challenges';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {getTopicIcon} from '@src/shared/assets/icons/Topics';

export const getTabIcon = (routName: string) => {
  let getIcon;

  switch (routName) {
    case TabRoutesNames.CATEGORIES:
      getIcon = getCategoriesIcon;
      break;
    case TabRoutesNames.TOPICS:
      getIcon = getTopicIcon;
      break;
    case TabRoutesNames.BOOKS:
      getIcon = getBooksIcon;
      break;
    case TabRoutesNames.CHALLENGES:
      getIcon = getChallengesIcon;
      break;
    default:
      getIcon = getCategoriesIcon;
  }

  return getIcon;
};
