import {StyleSheet, TextInput, View} from 'react-native';
import React, {memo, useCallback, useEffect, useMemo} from 'react';

import {StyleType} from '@src/shared/types/types';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '../AppText/AppText';

interface TextAreaProps {
  onChange?: (value: string) => void;
  value?: string;
  style?: StyleType;
  placeholder?: string | null;
  label?: string | null;
  initialValue?: string;
  disabled?: boolean;
}

export const TextArea = memo((props: TextAreaProps) => {
  const {
    onChange,
    value,
    style,
    placeholder,
    label,
    initialValue,
    disabled = false,
    ...rest
  } = props;

  const colors = useColors();

  useEffect(() => {
    if (!initialValue) {
      return;
    }

    onChange?.(initialValue);
  }, [initialValue, onChange]);

  const onChangeTextHandler = useCallback(
    (text: string) => {
      onChange?.(text);
    },
    [onChange],
  );

  const mode = useMemo(() => {
    return [
      styles.input,
      {
        color: colors.white,
      },
      style,
    ];
  }, [colors.white, style]);

  const textSize = useMemo(() => {
    return {color: colors.white};
  }, [colors]);

  return (
    <View>
      {label && (
        <View style={styles.labelWrapper}>
          <AppText
            style={textSize}
            size={TextSize.LEVEL_2}
            weight={'600'}
            text={label}
          />
        </View>
      )}

      <View>
        <View style={[styles.layout, {backgroundColor: colors.white}]} />

        <View style={styles.inputWrapper}>
          <TextInput
            editable={!disabled}
            style={mode}
            onChangeText={onChangeTextHandler}
            value={value}
            placeholder={placeholder || undefined}
            placeholderTextColor={colors.white}
            multiline={true}
            textAlignVertical="top"
            {...rest}
          />
        </View>
      </View>
    </View>
  );
});

const borderRadius = moderateScale(15);

const styles = StyleSheet.create({
  layout: {
    borderRadius,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.2,
  },

  inputWrapper: {
    padding: horizontalScale(8),
  },
  input: {
    height: verticalScale(140),
    borderRadius,
    paddingHorizontal: horizontalScale(10),
  },
  labelWrapper: {
    marginBottom: verticalScale(8),
  },
});
