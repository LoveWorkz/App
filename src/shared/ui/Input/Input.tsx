import React, {memo, useCallback, useEffect} from 'react';
import {
  KeyboardType,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';

export enum Inputheme {}

interface InputProps {
  onChange?: (value: string) => void;
  value?: string;
  theme?: Inputheme;
  style?: Record<string, string | number>;
  placeholder?: string;
  label?: string;
  error?: string;
  initialValue?: string;
  keyboardType?: KeyboardType;
}

export const Input = memo((props: InputProps) => {
  const {
    onChange,
    value,
    theme = '',
    style,
    placeholder,
    label,
    error = '',
    initialValue,
    keyboardType = 'default',
    ...rest
  } = props;

  useEffect(() => {
    onChange?.(initialValue || '');
  }, [initialValue, onChange]);

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
        keyboardType={keyboardType}
        style={[styles.input, style, styles[theme]]}
        onChangeText={onChangeTextHandler}
        value={value}
        placeholder={placeholder}
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
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
  errorText: {
    color: 'red',
    position: 'absolute',
    bottom: -15,
  },
});
