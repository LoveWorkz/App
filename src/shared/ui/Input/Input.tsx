import React, {memo} from 'react';
import {StyleSheet, TextInput} from 'react-native';

export enum Inputheme {}

interface InputProps {
  onChange?: () => void;
  value?: string;
  theme?: Inputheme;
  style?: any;
  placeholder?: string;
}

export const Input = memo((props: InputProps) => {
  const {onChange, value, theme = '', style, placeholder, ...rest} = props;

  return (
    <TextInput
      style={[style, styles.input, styles[theme]]}
      onChangeText={onChange}
      value={value}
      placeholder={placeholder}
      {...rest}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    padding: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9A9AA5',
    borderStyle: 'solid',
    borderRadius: 10,
  },
});
