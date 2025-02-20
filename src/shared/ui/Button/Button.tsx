import {useColors} from '@src/app/providers/colorsProvider';
import {windowWidth} from '@src/app/styles/GlobalStyle';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import React, {ReactElement, useMemo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

import {Gradient} from '../Gradient/Gradient';
import {GradientOutline} from '../Gradient/GradientOutline';
import Skeleton from '../Skeleton/Skeleton';

export enum ButtonTheme {
  CLEAR = 'clear',
  OUTLINED = 'outlined',
  GRADIENT = 'gradient',
  OUTLINED_GRADIENT = 'outlinedGradient',
  NORMAL = 'normal',
}

interface ButtonProps {
  onPress?: () => void;
  children: ReactElement | ReactElement[];
  theme?: ButtonTheme;
  style?:
    | Record<string, string | number | object>
    | Record<string, string | number | object>[];
  disabled?: boolean;
  squar?: boolean;
  isLoading?: boolean;
  backgroundColor?: string;
  activeOpacity?: number;
}

const height = horizontalScale(50);
const borderRadius = moderateScale(10);

export const Button = (props: ButtonProps) => {
  const {
    onPress,
    children,
    theme = ButtonTheme.CLEAR,
    style,
    disabled,
    squar,
    isLoading = false,
    backgroundColor,
    activeOpacity = 0.6,
  } = props;
  const colors = useColors();

  const mode = useMemo(() => {
    return [
      styles.Button,
      //@ts-ignore
      styles[theme],
      disabled ? styles.disabled : '',
      squar ? styles.squar : '',
      {backgroundColor},
      style,
    ];
  }, [disabled, theme, style, squar, backgroundColor]);

  if (isLoading) {
    return (
      <Skeleton
        height={height}
        width={windowWidth / 2}
        borderRadius={borderRadius}
      />
    );
  }

  if (theme === ButtonTheme.GRADIENT) {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        style={mode}
        disabled={disabled}
        onPress={onPress}>
        <Gradient style={[...mode, styles.contentWrapper]}>{children}</Gradient>
      </TouchableOpacity>
    );
  }

  if (theme === ButtonTheme.OUTLINED_GRADIENT) {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        style={mode}
        disabled={disabled}
        onPress={onPress}>
        <GradientOutline
          borderWeight={1}
          radius={10}
          style={[...mode, styles.contentWrapper]}
          contentStyle={[
            styles.content,
            {backgroundColor: colors.bgQuinaryColor},
          ]}>
          {children}
        </GradientOutline>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      disabled={disabled}
      style={mode}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Button: {
    height: height,
    paddingHorizontal: horizontalScale(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlined: {
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    borderRadius: borderRadius,
  },
  normal: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius,
    paddingHorizontal: horizontalScale(10),
  },
  disabled: {
    opacity: 0.7,
  },
  squar: {
    padding: 1,
    height: verticalScale(30),
    width: horizontalScale(30),
  },
  content: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
  },
});
