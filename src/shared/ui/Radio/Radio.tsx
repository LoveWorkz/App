import React, {memo, useEffect} from 'react';
import {StyleSheet, SafeAreaView, View, Pressable} from 'react-native';

import {AppText, TextSize, TextType} from '@src/shared/ui/AppText/AppText';

interface RadioProps {
  data: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  initialValue?: string;
}

export const Radio = memo((props: RadioProps) => {
  const {data, onChange, value, error, initialValue} = props;

  useEffect(() => {
    onChange?.(initialValue || data[0]);
  }, [initialValue, onChange, data]);

  return (
    <SafeAreaView>
      {data.map(item => {
        return (
          <Pressable
            key={item}
            style={styles.radio}
            onPress={() => onChange(item)}>
            <View style={styles.round}>
              {value === item ? <View style={styles.checked} /> : null}
            </View>
            <AppText style={styles.text} size={TextSize.LEVEL_4} text={item} />
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
  text: {
    marginLeft: 10,
  },
  errorText: {
    position: 'absolute',
    bottom: -10,
  },
});
