import React, {memo, ReactElement, useMemo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

export enum ButtonTheme {
  CLEAR = 'clear',
  OUTLINED = 'outlined',
}

interface ButtonProps {
  onPress?: () => void;
  children: ReactElement;
  theme?: ButtonTheme;
  style?: Record<string, string | number>;
  disabled?: boolean;
}

export const Button = memo((props: ButtonProps) => {
  const {onPress, children, theme = ButtonTheme.CLEAR, style, disabled} = props;

  const mode = useMemo(() => {
    return [
      style,
      styles.Button,
      styles[theme],
      disabled ? styles.disabled : '',
    ];
  }, [disabled, theme, style]);

  return (
    <TouchableOpacity disabled={disabled} style={mode} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
});

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
});
