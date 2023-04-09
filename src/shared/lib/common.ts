export const cutText = ({text, textSize}: {text: string; textSize: number}) => {
  let newText = '';
  if (text.length > textSize) {
    newText = text.slice(0, textSize);
  }

  return newText;
};
