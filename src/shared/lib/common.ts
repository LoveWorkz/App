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
