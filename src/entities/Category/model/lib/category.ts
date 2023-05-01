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
