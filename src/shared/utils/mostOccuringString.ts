export function mostOccurringString(
  arr: (string | undefined)[],
): string | null {
  if (arr.length === 0) {
    return null;
  }

  const frequencyMap: {[key: string]: number} = {};

  arr.forEach(str => {
    if (str !== undefined) {
      if (frequencyMap[str]) {
        frequencyMap[str]++;
      } else {
        frequencyMap[str] = 1;
      }
    }
  });

  let maxCount = 0;
  let mostFrequentString = '';

  for (const str in frequencyMap) {
    if (frequencyMap[str] > maxCount) {
      maxCount = frequencyMap[str];
      mostFrequentString = str;
    }
  }

  return mostFrequentString;
}
