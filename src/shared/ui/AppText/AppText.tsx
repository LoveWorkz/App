import React, {memo, useMemo} from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextLayoutEventData,
  TextStyle,
} from 'react-native';

import {globalStyles} from '@src/app/styles/GlobalStyle';
// import {StyleType} from '@src/shared/types/types';
import {useColors} from '@src/app/providers/colorsProvider';
import {moderateScale} from '@src/shared/lib/Metrics';
import {
  AlignType,
  EllipsizeMode,
  TextWeight,
} from '@src/shared/types/textTypes';

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
  SIZE_24 = 'size_24',
  SIZE_32 = 'size_32',
  SIZE_38 = 'size_38',
  SIZE_68 = 'size_68',
}

export enum TextType {
  PRIMARY = 'primary',
  ERROR = 'error',
}

export interface AppTextProps {
  text: string;
  size?: TextSize;
  weight?: TextWeight;
  type?: TextType;
  style?: StyleProp<TextStyle>;
  lineHeight?: number;
  align?: AlignType;
  ellipsizeMode?: EllipsizeMode;
  numberOfLines?: number;
  onTextLayout?: (param: NativeSyntheticEvent<TextLayoutEventData>) => void;
  letterSpacing?: number;
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
    onTextLayout,
    letterSpacing,
  } = props;

  const colors = useColors();

  const mode = useMemo(() => {
    return [
      {
        ...(parseFloat(weight) < 600
          ? globalStyles.Quicksand_Regular
          : globalStyles.Quicksand_SemiBold),
      },
      {
        textAlign: align,
        fontWeight: parseFloat(weight) >= 700 ? 600 : weight,
        letterSpacing,
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
    letterSpacing,
  ]);

  return (
    <Text
      maxFontSizeMultiplier={1.1}
      onTextLayout={onTextLayout}
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
  size_24: {
    ...globalStyles.size_24,
  },
  size_32: {
    ...globalStyles.size_32,
  },
  size_38: {
    ...globalStyles.size_38,
  },
  size_68: {
    ...globalStyles.size_68,
  },
});
