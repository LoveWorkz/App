import React, {memo, useEffect} from 'react';
import {StyleSheet, SafeAreaView, Pressable, View} from 'react-native';

import {AppText, TextSize, TextType} from '@src/shared/ui/AppText/AppText';
import {StyleType} from '@src/shared/types/types';
import {Gradient} from '../Gradient/Gradient';

interface RadioProps {
  data: string[];
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
    onChange?.(initialValue || data[0]);
  }, [initialValue, onChange, data]);

  return (
    <SafeAreaView>
      {data.map(item => {
        return (
          <Pressable
            key={item}
            style={[styles.radio, style]}
            onPress={() => onChange(item)}>
            <View style={[styles.round, {...roundStyle}]}>
              {value === item ? (
                <Gradient style={[styles.checked, {...activeItemStyle}]} />
              ) : (
                <></>
              )}
            </View>
            <AppText style={nameStyle} size={TextSize.LEVEL_4} text={item} />
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
