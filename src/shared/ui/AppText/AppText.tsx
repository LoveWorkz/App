import React, {memo, useMemo} from 'react';
import {StyleSheet, Text} from 'react-native';

import GlobalStyles, {FontSizes} from '@src/app/styles/GlobalStyle';

export enum TextSize {
  LEVEL_1 = 'size_1',
  LEVEL_2 = 'size_2',
  LEVEL_3 = 'size_3',
  LEVEL_4 = 'size_4',
  LEVEL_5 = 'size_5',
  LEVEL_6 = 'size_6',
  LEVEL_7 = 'size_7',
}

export type TextWeight =
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

export enum TextType {
  PRIMARY = 'primary',
  ERROR = 'error',
}

interface AppTextProps {
  text: string;
  size?: TextSize;
  weight?: TextWeight;
  type?: TextType;
  style?: Record<string, string | number | object>;
}

export const AppText = memo((props: AppTextProps) => {
  const {
    text,
    size = TextSize.LEVEL_3,
    weight = '400',
    type = TextType.PRIMARY,
    style,
  } = props;

  const mode = useMemo(() => {
    return [
      GlobalStyles.textFont,
      {
        fontWeight: weight,
      },
      styles[size],
      styles[type],
      style,
    ];
  }, [size, weight, type, style]);

  return <Text style={mode}>{text}</Text>;
});

const styles = StyleSheet.create<Record<string, any>>({
  primary: {},
  size_1: {
    fontSize: FontSizes.SIZE_1,
  },
  size_2: {
    fontSize: FontSizes.SIZE_2,
  },
  size_3: {
    fontSize: FontSizes.SIZE_3,
  },
  size_4: {
    fontSize: FontSizes.SIZE_4,
  },
  size_5: {
    fontSize: FontSizes.SIZE_5,
  },
  size_6: {
    fontSize: FontSizes.SIZE_6,
  },
  size_7: {
    fontSize: FontSizes.SIZE_7,
  },
  error: {
    color: 'red',
  },
});
