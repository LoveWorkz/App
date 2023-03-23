import React, {ReactElement, useMemo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

export enum ButtonTheme {
  CLEAR = 'clear',
  OUTLINED = 'outlined',
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

  const mode = useMemo(() => {
    return [
      styles.Button,
      style,
      styles[theme],
      disabled ? styles.disabled : '',
      squar ? styles.squar : '',
    ];
  }, [disabled, theme, style, squar]);

  return (
    <TouchableOpacity disabled={disabled} style={mode} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create<Record<string, any>>({
  Button: {
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlined: {
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    borderRadius: 10,
  },
  disabled: {
    opacity: 0.4,
  },
  squar: {
    padding: 1,
    height: 30,
    width: 30,
  },
});
