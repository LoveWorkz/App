import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  KeyboardType,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {EyeIcon} from '@src/shared/assets/icons/Eye';
import {whitespaceRegexp} from '@src/shared/consts/validation';
import {useColors} from '@src/app/providers/colorsProvider';
import {getShadowOpacity, globalStyles} from '@src/app/styles/GlobalStyle';
import {StyleType} from '@src/shared/types/types';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {useTheme} from '@src/app/providers/themeProvider';
import {AppText, TextSize, TextType} from '../AppText/AppText';
import {Button} from '../Button/Button';
import Skeleton from '../Skeleton/Skeleton';

export enum Inputheme {}

interface InputProps {
  onChange?: (value: string) => void;
  value?: string;
  theme?: Inputheme;
  style?: StyleType;
  placeholder?: string | null;
  label?: string | null;
  error?: string | null;
  initialValue?: string;
  keyboardType?: KeyboardType;
  secureTextEntry?: boolean;
  isSpaceAllowed?: boolean;
  StartIcon?: React.ComponentType<any>;
  isLoading?: boolean;
  placeholderTextColor?: string;
}

const height = 40;
const borderRadius = moderateScale(10);

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
    isLoading = false,
    placeholderTextColor,
    ...rest
  } = props;
  const colors = useColors();
  const {theme: appTheme} = useTheme();

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

  if (isLoading) {
    return (
      <SafeAreaView style={[style]}>
        <View style={styles.uploadPhotoWrapper}>
          {label && (
            <View style={styles.inputText}>
              <Skeleton width={50} height={13} />
            </View>
          )}
          <Skeleton
            width={'100%'}
            height={height}
            borderRadius={borderRadius}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        style,
        {
          ...getShadowOpacity(appTheme, colors.bgColor).shadowOpacity_level_1,
          borderRadius,
        },
      ]}>
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
      <View style={styles.inputWrapper}>
        <TextInput
          autoCapitalize="none"
          secureTextEntry={isPasswordHidden}
          keyboardType={keyboardType}
          style={[
            styles.input,
            styles[theme],
            {
              color: colors.primaryTextColor,
              paddingLeft: StartIcon
                ? horizontalScale(50)
                : horizontalScale(20),
              backgroundColor: colors.bgTertiaryColor,
            },
          ]}
          onChangeText={onChangeTextHandler}
          value={value}
          placeholder={placeholder || undefined}
          placeholderTextColor={
            placeholderTextColor || colors.secondaryTextColor
          }
          {...rest}
        />
        {secureTextEntry && (
          <Button
            onPress={togglePasswordHiddenHandler}
            style={styles.eyeIconWrapper}>
            <SvgXml xml={EyeIcon} style={styles.eyeIcon} />
          </Button>
        )}
      </View>

      {error && (
        <AppText
          size={TextSize.LEVEL_1}
          weight={'500'}
          type={TextType.ERROR}
          style={[styles.errorText, {color: colors.secondaryError}]}
          text={error}
        />
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create<any>({
  inputWrapper: {
    justifyContent: 'center',
    borderRadius,
  },
  input: {
    height: 40,
    alignItems: 'center',
    borderRadius: borderRadius,
    paddingRight: horizontalScale(20),
  },
  inputText: {
    marginBottom: verticalScale(5),
  },
  errorText: {
    position: 'absolute',
    bottom: -14,
  },
  eyeIconWrapper: {
    position: 'absolute',
    right: horizontalScale(10),
    width: horizontalScale(30),
  },
  startIconWrapper: {
    position: 'absolute',
    left: 25,
    bottom: 15,
    ...globalStyles.inputStartIconZIndex,
  },
  eyeIcon: {
    width: horizontalScale(18),
    height: verticalScale(16),
  },
});
