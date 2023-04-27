import React, {memo, useEffect} from 'react';
import {StyleSheet, SafeAreaView, Pressable, View} from 'react-native';

import {AppText, TextSize, TextType} from '@src/shared/ui/AppText/AppText';
import {StyleType} from '@src/shared/types/types';
import {Gradient} from '../Gradient/Gradient';

interface RadioProps {
  data: {label: string; value: string}[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  initialValue?: string;
  style?: StyleType;
  nameStyle?: StyleType;
  roundStyle?: StyleType;
  activeItemStyle?: StyleType;
}

export const Radio = memo((props: RadioProps) => {
  const {
    data,
    onChange,
    value,
    error,
    initialValue,
    style,
    nameStyle,
    roundStyle,
    activeItemStyle,
  } = props;

  useEffect(() => {
    initialValue && onChange?.(initialValue);
  }, [onChange, initialValue]);

  return (
    <SafeAreaView>
      {data.map(item => {
        return (
          <Pressable
            key={item.value}
            style={[styles.radio, style]}
            onPress={() => onChange(item.value)}>
            <View style={[styles.round, {...roundStyle}]}>
              {value === item.value ? (
                <Gradient style={[styles.checked, {...activeItemStyle}]} />
              ) : (
                <></>
              )}
            </View>
            <AppText
              style={[styles.radioText, {...nameStyle}]}
              size={TextSize.LEVEL_4}
              text={item.label}
            />
          </Pressable>
        );
      })}
      {error && (
        <AppText style={styles.errorText} type={TextType.ERROR} text={error} />
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  radio: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  round: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    width: 20,
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 50,
  },
  radioText: {
    flexShrink: 1,
  },
  checked: {
    backgroundColor: 'black',
    height: 13,
    width: 13,
    borderRadius: 50,
  },
  errorText: {
    position: 'absolute',
    bottom: -10,
  },
});
