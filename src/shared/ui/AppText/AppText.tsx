import React, {memo, useMemo} from 'react';
import {StyleSheet, Text} from 'react-native';

import {globalStyles} from '@src/app/styles/GlobalStyle';
import {StyleType} from '@src/shared/types/types';
import {useColors} from '@src/app/providers/colorsProvider';
import {moderateScale} from '@src/shared/lib/Metrics';

export enum TextSize {
  LEVEL_1 = 'size_1',
  LEVEL_2 = 'size_2',
  LEVEL_3 = 'size_3',
  LEVEL_4 = 'size_4',
  LEVEL_5 = 'size_5',
  LEVEL_6 = 'size_6',
  LEVEL_7 = 'size_7',
  LEVEL_8 = 'size_8',
  LEVEL_9 = 'size_9',
  SIZE_48 = 'size_48',
}

type EllipsizeMode = 'head' | 'middle' | 'tail' | 'clip' | undefined;

export type TextWeight =
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | 'normal'
  | 'bold';

export enum TextType {
  PRIMARY = 'primary',
  ERROR = 'error',
}
export type AlignType = 'left' | 'right' | 'center' | 'justify';

interface AppTextProps {
  text: string;
  size?: TextSize;
  weight?: TextWeight;
  type?: TextType;
  style?: StyleType;
  lineHeight?: number;
  align?: AlignType;
  ellipsizeMode?: EllipsizeMode;
  numberOfLines?: number;
}

export const AppText = memo((props: AppTextProps) => {
  const {
    text,
    size = TextSize.LEVEL_3,
    weight = '400',
    type = TextType.PRIMARY,
    style,
    lineHeight,
    align = 'left',
    ellipsizeMode,
    numberOfLines,
  } = props;

  const colors = useColors();

  const mode = useMemo(() => {
    return [
      {
        ...(weight < '600'
          ? globalStyles.Quicksand_Regular
          : globalStyles.Quicksand_SemiBold),
      },
      {
        textAlign: align,
        fontWeight: weight,
        color:
          type === TextType.ERROR
            ? colors.secondaryError
            : colors.primaryTextColor,
      },
      lineHeight ? {lineHeight: moderateScale(lineHeight)} : undefined,
      styles[size],
      styles[type],
      style,
    ];
  }, [
    size,
    weight,
    type,
    style,
    colors.primaryTextColor,
    colors.secondaryError,
    lineHeight,
    align,
  ]);

  return (
    <Text
      ellipsizeMode={ellipsizeMode}
      numberOfLines={numberOfLines}
      style={mode}>
      {text}
    </Text>
  );
});

const styles = StyleSheet.create<Record<string, any>>({
  size_1: {
    ...globalStyles.size_1,
  },
  size_2: {
    ...globalStyles.size_2,
  },
  size_3: {
    ...globalStyles.size_3,
  },
  size_4: {
    ...globalStyles.size_4,
  },
  size_5: {
    ...globalStyles.size_5,
  },
  size_6: {
    ...globalStyles.size_6,
  },
  size_7: {
    ...globalStyles.size_7,
  },
  size_8: {
    ...globalStyles.size_8,
  },
  size_9: {
    ...globalStyles.size_9,
  },
  size_48: {
    ...globalStyles.size_48,
  },
});
