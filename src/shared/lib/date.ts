export function datediff(first: Date, second: Date) {
  const diffTime = Math.abs(first.getTime() - second.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function hoursDiff(first: number, second: number) {
  const difference = second - first;
  return Math.abs(difference) / 36e5;
}

export function minutesDiff(dateTimeValue2: Date, dateTimeValue1: Date) {
  var differenceValue =
    (dateTimeValue2.getTime() - dateTimeValue1.getTime()) / 1000;
  differenceValue /= 60;
  return Math.abs(Math.round(differenceValue));
}
