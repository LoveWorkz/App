import React, {memo, useCallback} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput} from 'react-native';

export enum Inputheme {}

interface InputProps {
  onChange?: (value: string) => void;
  value?: string;
  theme?: Inputheme;
  style?: Record<string, string | number>;
  placeholder?: string;
  label?: string;
}

export const Input = memo((props: InputProps) => {
  const {
    onChange,
    value,
    theme = '',
    style,
    placeholder,
    label,
    ...rest
  } = props;

  const onChangeTextHandler = useCallback(
    (text: string) => {
      onChange?.(text);
    },
    [onChange],
  );

  return (
    <SafeAreaView>
      <Text>{label}</Text>
      <TextInput
        style={[styles.input, style, styles[theme]]}
        onChangeText={onChangeTextHandler}
        value={value}
        placeholder={placeholder}
        {...rest}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create<Record<string, any>>({
  input: {
    height: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#9A9AA5',
    borderBottomStyle: 'solid',
  },
});
