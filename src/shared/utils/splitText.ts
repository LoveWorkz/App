const splitText = (text: string) => {
  // Use split to divide by the first space
  let [firstWord, ...remainingWords] = text.split(' ');
  
  // Join the remaining words back into a single string
  const otherText = remainingWords.join(' ');
  
  firstWord = firstWord + ' ';

  return { firstWord, otherText };
}

export default splitText;
