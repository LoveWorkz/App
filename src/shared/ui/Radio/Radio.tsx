import React, {memo, useEffect} from 'react';
import {StyleSheet, SafeAreaView, View, Text, Pressable} from 'react-native';

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
            <Text style={styles.text}>{item}</Text>
          </Pressable>
        );
      })}
      <Text style={styles.errorText}>{error}</Text>
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
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    position: 'absolute',
    bottom: -10,
  },
});
