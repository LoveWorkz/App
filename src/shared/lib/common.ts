import {BookType} from '@src/entities/Book';
import {CategoryType} from '@src/entities/Category';
import {ChallengeType, SpecialChallengeType} from '@src/entities/Challenge';
import {ChallengeCategoryType} from '@src/entities/ChallengeCategory';
import {RubricType} from '@src/entities/Rubric';
import {SessionType} from '@src/entities/Session';

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
    | BookType
    | SessionType
    | SpecialChallengeType;
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

export const getNextElementById = <T extends {id: string}>({
  id,
  array,
}: {
  id: string;
  array: T[];
}): T | null => {
  const index = array.findIndex(item => item.id === id);

  const nextItem =
    index !== -1 && index < array.length - 1 ? array[index + 1] : null;

  return nextItem;
};

export const normaliseData = <T extends {id: string; [key: string]: any}>(
  data: T[],
  field?: string,
) => {
  const map: Record<string, T> = {};

  data.forEach(item => {
    map[field ? item[field] : item.id] = item;
  });

  return map;
};

export const delay = (milliseconds: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
};

export const monthlyToWeekly = (cost: number) => {
  const averageWeeksPerMonth = 4.33;
  return (cost / averageWeeksPerMonth).toFixed(2);
};

export const threeMonthsToWeekly = (cost: number) => {
  const weeksInThreeMonths = 13; // 3 months * 4.33 weeks per month
  return (cost / weeksInThreeMonths).toFixed(2);
};

export const yearlyToWeekly = (cost: number) => {
  const weeksInYear = 52;
  return (cost / weeksInYear).toFixed(2);
};

export const extractCurrencyAndPrice = (formattedPrice: string) => {
  // Check if input is empty or undefined
  if (!formattedPrice) {
    return {currency: undefined, price: undefined};
  }

  // Regex to extract potential currency symbols followed by numbers
  const regex = /^([^\d]+)?(\d+(?:[,.]\d{2})?)$/;
  const match = formattedPrice.match(regex);

  if (match) {
    const currency = match[1] ? match[1].trim() : undefined;
    let price = match[2];

    if (price) {
      // Normalize decimal separator: replace comma only if it acts as a decimal separator
      price = price.replace(/,/g, '.');
      return {
        currency,
        price: parseFloat(price),
      };
    }
  }

  // Return undefined if the regex does not match or if parts are missing
  return {currency: undefined, price: undefined};
};

export const ordinalSuffixOf = (number: number) => {
  const j = number % 10,
    k = number % 100;
  if (j === 1 && k !== 11) {
    return number + 'st';
  }
  if (j === 2 && k !== 12) {
    return number + 'nd';
  }
  if (j === 3 && k !== 13) {
    return number + 'rd';
  }
  return number + 'th';
};

export const removeDuplicates = <T>(arr: Array<T>): T[] => {
  return Array.from(new Set(arr));
};
