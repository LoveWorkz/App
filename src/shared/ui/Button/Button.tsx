import {useColors} from '@src/app/providers/colorsProvider';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import React, {ReactElement, useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {Gradient} from '../Gradient/Gradient';

export enum ButtonTheme {
  CLEAR = 'clear',
  OUTLINED = 'outlined',
  GRADIENT = 'gradient',
  OUTLINED_GRADIENT = 'outlinedGradient',
}

interface ButtonProps {
  onPress?: () => void;
  children: ReactElement;
  theme?: ButtonTheme;
  style?:
    | Record<string, string | number | object>
    | Record<string, string | number | object>[];
  disabled?: boolean;
  squar?: boolean;
}

export const Button = (props: ButtonProps) => {
  const {
    onPress,
    children,
    theme = ButtonTheme.CLEAR,
    style,
    disabled,
    squar,
  } = props;
  const colors = useColors();

  const mode = useMemo(() => {
    return [
      styles.Button,
      style,
      styles[theme],
      disabled ? styles.disabled : '',
      squar ? styles.squar : '',
    ];
  }, [disabled, theme, style, squar]);

  if (theme === ButtonTheme.GRADIENT) {
    return (
      <TouchableOpacity style={mode} disabled={disabled} onPress={onPress}>
        <Gradient style={[...mode, styles.contentWrapper]}>{children}</Gradient>
      </TouchableOpacity>
    );
  }

  if (theme === ButtonTheme.OUTLINED_GRADIENT) {
    return (
      <TouchableOpacity style={mode} disabled={disabled} onPress={onPress}>
        <Gradient style={[...mode, styles.contentWrapper]}>
          <View
            style={[styles.content, {backgroundColor: colors.bgQuinaryColor}]}>
            {children}
          </View>
        </Gradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity disabled={disabled} style={mode} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create<Record<string, any>>({
  Button: {
    height: verticalScale(40),
    paddingHorizontal: horizontalScale(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlined: {
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    borderRadius: moderateScale(10),
  },
  disabled: {
    opacity: 0.4,
  },
  squar: {
    padding: 1,
    height: verticalScale(30),
    width: horizontalScale(30),
  },
  content: {
    flex: 1,
    margin: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(10),
  },
  contentWrapper: {
    width: '100%',
  },
});
