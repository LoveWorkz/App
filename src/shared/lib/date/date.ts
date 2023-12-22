export const getDateYYYYMMDD = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const formatDateString = (dateString: string) => {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
};
