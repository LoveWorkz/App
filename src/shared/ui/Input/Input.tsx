import {EyeIcon} from '@src/shared/assets/icons/Eye';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  KeyboardType,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import {SvgXml} from 'react-native-svg';

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
  secureTextEntry?: boolean;
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
    secureTextEntry,
    ...rest
  } = props;

  const [isPasswordHidden, setIsPasswordHidden] = useState(false);

  useEffect(() => {
    onChange?.(initialValue || '');
  }, [initialValue, onChange]);

  useEffect(() => {
    secureTextEntry && setIsPasswordHidden(secureTextEntry);
  }, [secureTextEntry]);

  const onChangeTextHandler = useCallback(
    (text: string) => {
      onChange?.(text);
    },
    [onChange],
  );

  const togglePasswordHiddenHandler = () => {
    setIsPasswordHidden(prev => !prev);
  };

  return (
    <SafeAreaView style={style}>
      <Text>{label}</Text>
      <TextInput
        secureTextEntry={isPasswordHidden}
        keyboardType={keyboardType}
        style={[styles.input, styles[theme]]}
        onChangeText={onChangeTextHandler}
        value={value}
        placeholder={placeholder}
        {...rest}
      />
      <Pressable
        onPress={togglePasswordHiddenHandler}
        style={styles.eyeIconWrapper}>
        {secureTextEntry && <SvgXml xml={EyeIcon} style={styles.eyeIcon} />}
      </Pressable>
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
    bottom: -17,
  },
  eyeIconWrapper: {
    position: 'absolute',
    right: 10,
    bottom: 15,
  },
  eyeIcon: {
    width: 13,
    height: 10,
  },
});
