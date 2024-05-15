import React, {memo} from 'react';
import {Text} from 'react-native';

import {StyleType} from '@src/shared/types/types';
import {AppText} from '../AppText/AppText';

interface StyledWordTextProps {
  text: string;
  styledWords: string[];
  style?: StyleType;
  styledWordStyle?: StyleType;
  textStyle?: StyleType;
}

export const StyledWordText = memo((props: StyledWordTextProps) => {
  const {text, styledWords, style, styledWordStyle, textStyle} = props;

  // Function to determine if the part matches any of the styled words
  const isStyledWord = (part: string) => {
    return styledWords.some(
      styledWord => part.toLowerCase() === styledWord.toLowerCase(),
    );
  };

  // Split the text into parts based on spaces to check each word
  const parts = text.split(' ');

  return (
    <Text style={style}>
      {parts.map((part, index) => {
        const key = `${part}-${index}`;
        const addSpace = index < parts.length - 1 ? ' ' : '';
        return isStyledWord(part) ? (
          <AppText key={key} style={styledWordStyle} text={part + addSpace} />
        ) : (
          <AppText key={key} style={textStyle} text={part + addSpace} />
        );
      })}
    </Text>
  );
});
