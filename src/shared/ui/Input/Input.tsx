import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  KeyboardType,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {EyeIcon} from '@src/shared/assets/icons/Eye';
import {whitespaceRegexp} from '@src/shared/consts/validation';
import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize, TextType} from '../AppText/AppText';
import {globalStyles} from '@src/app/styles/GlobalStyle';
import {StyleType} from '@src/shared/types/types';
import {horizontalScale} from '@src/shared/lib/Metrics';

export enum Inputheme {}

interface InputProps {
  onChange?: (value: string) => void;
  value?: string;
  theme?: Inputheme;
  style?: StyleType;
  placeholder?: string;
  label?: string;
  error?: string;
  initialValue?: string;
  keyboardType?: KeyboardType;
  secureTextEntry?: boolean;
  isSpaceAllowed?: boolean;
  StartIcon?: React.ComponentType<any>;
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
    isSpaceAllowed = false,
    StartIcon,
    ...rest
  } = props;
  const colors = useColors();

  const [isPasswordHidden, setIsPasswordHidden] = useState(false);

  useEffect(() => {
    onChange?.(initialValue || '');
  }, [initialValue, onChange]);

  useEffect(() => {
    secureTextEntry && setIsPasswordHidden(secureTextEntry);
  }, [secureTextEntry]);

  const onChangeTextHandler = useCallback(
    (text: string) => {
      let newValue = text.replace(whitespaceRegexp, '');

      if (isSpaceAllowed) {
        newValue = text;
      }
      onChange?.(newValue);
    },
    [onChange, isSpaceAllowed],
  );

  const togglePasswordHiddenHandler = () => {
    setIsPasswordHidden(prev => !prev);
  };

  return (
    <SafeAreaView style={[style, {...globalStyles.simpleShadowOpacity}]}>
      {label && (
        <AppText
          style={[styles.inputText, {color: colors.primaryTextColor}]}
          size={TextSize.LEVEL_2}
          weight={'600'}
          text={label}
        />
      )}
      <View style={styles.startIconWrapper}>
        {StartIcon ? <StartIcon /> : <></>}
      </View>
      <TextInput
        autoCapitalize="none"
        secureTextEntry={isPasswordHidden}
        keyboardType={keyboardType}
        style={[
          styles.input,
          styles[theme],
          {
            color: colors.primaryTextColor,
            paddingLeft: StartIcon ? horizontalScale(50) : horizontalScale(20),
          },
        ]}
        onChangeText={onChangeTextHandler}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={'#9A9AA5'}
        {...rest}
      />
      <Pressable
        onPress={togglePasswordHiddenHandler}
        style={styles.eyeIconWrapper}>
        {secureTextEntry && <SvgXml xml={EyeIcon} style={styles.eyeIcon} />}
      </Pressable>
      {error && (
        <AppText
          size={TextSize.LEVEL_1}
          weight={'500'}
          type={TextType.ERROR}
          style={styles.errorText}
          text={error}
        />
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create<Record<string, any>>({
  input: {
    height: 40,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingRight: 20,
  },
  inputText: {
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    position: 'absolute',
    bottom: -14,
  },
  eyeIconWrapper: {
    position: 'absolute',
    right: 10,
    bottom: 15,
  },
  startIconWrapper: {
    position: 'absolute',
    left: 25,
    bottom: 15,
    zIndex: 10,
  },
  eyeIcon: {
    width: 13,
    height: 10,
  },
});
