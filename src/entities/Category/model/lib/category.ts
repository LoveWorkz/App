import {TFunction} from 'i18next';
import {CategoryName} from '../types/categoryTypes';

export const getNextCategoryName = ({
  currentCategory,
}: {
  currentCategory: CategoryName;
}) => {
  switch (currentCategory) {
    case 'Starter':
      return 'Basic';
    case 'Basic':
      return 'Deep';
    case 'Deep':
      return 'Intimate';
    case 'Intimate':
      return 'Hot';
    default:
      return 'AllInOne';
  }
};

export const translateCategory = ({
  t,
  name,
}: {
  t: TFunction;
  name: CategoryName;
}) => {
  if (name.toLocaleLowerCase() === 'all in one') {
    return t('categories.All_in_one');
  }
  return t(`categories.${name}`);
};
