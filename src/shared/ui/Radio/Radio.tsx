import React, {memo} from 'react';
import {StyleSheet, Pressable} from 'react-native';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {StyleType} from '@src/shared/types/types';
import {Gradient} from '../Gradient/Gradient';
import {GradientOutline} from '../Gradient/GradientOutline';

interface RadioProps {
  value: string;
  onChange: (value: string) => void;
  style?: StyleType;
  nameStyle?: StyleType;
  label: string;
  isSelected: boolean;
}

export const Radio = memo((props: RadioProps) => {
  const {onChange, value, style, nameStyle, label, isSelected} = props;
  const colors = useColors();

  const onHandleChange = () => {
    onChange?.(value);
  };

  return (
    <Pressable style={[styles.radio, style]} onPress={onHandleChange}>
      <GradientOutline
        borderWeight={2}
        radius={50}
        style={[styles.roundWrapper]}
        contentStyle={[styles.round, {backgroundColor: colors.bgColor}]}>
        {isSelected ? <Gradient style={[styles.checked]} /> : <></>}
      </GradientOutline>
      <AppText
        style={[styles.radioText, {...nameStyle}]}
        size={TextSize.LEVEL_4}
        text={label}
      />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  radio: {
    flexDirection: 'row',
  },
  roundWrapper: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
  round: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioText: {
    flexShrink: 1,
  },
  checked: {
    height: 10,
    width: 10,
    borderRadius: 50,
  },
  errorText: {
    position: 'absolute',
    bottom: -10,
  },
});
