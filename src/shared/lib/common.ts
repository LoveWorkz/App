import {BookType} from '@src/entities/Book';
import {CategoryType} from '@src/entities/Category';
import {ChallengeType} from '@src/entities/Challenge';
import {ChallengeCategoryType} from '@src/entities/ChallengeCategory';
import {RubricType} from '@src/entities/Rubric';

export const cutText = ({text, textSize}: {text: string; textSize: number}) => {
  let newText = '';
  if (text.length > textSize) {
    newText = text.slice(0, textSize);
  }

  return newText;
};

export const getPercentageFromNumber = (number: number, count: number) => {
  return (100 * number) / count;
};

export const getNumberFromPercentage = (count: number, percentage: number) => {
  return (count * percentage) / 100;
};

export const getNumbersDiff = (a: number, b: number) => {
  return Math.abs(a - b);
};

// we can use this function to add example data for skeleton
export const getEntityExampleDataForSkeleton = ({
  entity,
  count,
}: {
  entity:
    | ChallengeType
    | ChallengeCategoryType
    | CategoryType
    | RubricType
    | BookType;
  count: number;
}) => {
  const result = [];

  for (let i = 0; i < count; i++) {
    result.push({...entity, id: i.toString()});
  }

  return result;
};

export const getDefaultIndexForCarousel = (index?: number) => {
  return (index || 1) - 1;
};
