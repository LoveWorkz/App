import React, {memo, useEffect} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';

import {AppText, TextType} from '@src/shared/ui/AppText/AppText';
import {StyleType} from '@src/shared/types/types';
import {Radio} from './Radio';

interface RadioGroup {
  data: {label: string; value: string}[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  initialValue?: string;
  style?: StyleType;
}

export const RadioGroup = memo((props: RadioGroup) => {
  const {data, onChange, value, error, initialValue, style} = props;

  useEffect(() => {
    initialValue && onChange?.(initialValue);
  }, [onChange, initialValue]);

  return (
    <SafeAreaView>
      {data.map(item => {
        const isSelected = value === item.value;
        return (
          <Radio
            key={item.value}
            isSelected={isSelected}
            value={item.value}
            label={item.label}
            onChange={onChange}
            style={style}
          />
        );
      })}
      {error && (
        <AppText style={styles.errorText} type={TextType.ERROR} text={error} />
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  RadioGroup: {
    flexDirection: 'row',
    marginBottom: 15,
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
    backgroundColor: 'black',
    height: 10,
    width: 10,
    borderRadius: 50,
  },
  errorText: {
    position: 'absolute',
    bottom: -10,
  },
});
