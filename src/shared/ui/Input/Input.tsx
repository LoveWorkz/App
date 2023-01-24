import React, {memo, useCallback} from 'react';
import {StyleSheet, TextInput} from 'react-native';

export enum Inputheme {}

interface InputProps {
  onChange?: (value: string) => void;
  value?: string;
  theme?: Inputheme;
  style?: Record<string, string | number>;
  placeholder?: string;
}

export const Input = memo((props: InputProps) => {
  const {onChange, value, theme = '', style, placeholder, ...rest} = props;

  const onChangeTextHandler = useCallback(
    (text: string) => {
      onChange?.(text);
    },
    [onChange],
  );

  return (
    <TextInput
      style={[styles.input, style, styles[theme]]}
      onChangeText={onChangeTextHandler}
      value={value}
      placeholder={placeholder}
      {...rest}
    />
  );
});

const styles = StyleSheet.create<Record<string, any>>({
  input: {
    height: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9A9AA5',
    borderStyle: 'solid',
    borderRadius: 10,
  },
});
