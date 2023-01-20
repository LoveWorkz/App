import React, {memo, ReactElement} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

export enum ButtonTheme {
  CLEAR = 'clear',
  OUTLINED = 'outlined',
}

interface ButtonProps {
  onPress?: () => void;
  children: ReactElement;
  theme?: ButtonTheme;
  style?: any;
}

export const Button = memo((props: ButtonProps) => {
  const {onPress, children, theme = ButtonTheme.CLEAR, style} = props;

  return (
    <TouchableOpacity
      style={[style, styles.Button, styles[theme]]}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
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
});
