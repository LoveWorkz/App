export const getDateYYYYMMDD = (date: Date) => {
  return date.toISOString().split('T')[0];
};
