import React, {useCallback, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';

interface PikerItem {
  label: string;
  value: string;
}

export enum SelectTheme {
  CLEAR = 'clear',
  UNDERLINE = 'underline',
}

interface SelectProps {
  options: PikerItem[];
  value: string;
  label?: string;
  onSelect: (value: string) => void;
  initialValue?: string;
  prompt?: string;
  Theme: SelectTheme;
  itemStyles?: Record<string, string | number>;
  mode?: 'dialog' | 'dropdown';
  style?: Record<string, string | number>;
}

export const Select = (props: SelectProps) => {
  const {
    label,
    onSelect,
    options,
    value,
    initialValue,
    prompt,
    Theme = SelectTheme.UNDERLINE,
    itemStyles,
    mode = 'dialog',
    style,
  } = props;

  useEffect(() => {
    onSelect?.(initialValue || options[0]?.value);
  }, [initialValue, onSelect, options]);

  const onSelectHandler = useCallback(
    (itemValue: string) => {
      onSelect?.(itemValue);
    },
    [onSelect],
  );

  const pickerItem = options.map(item => {
    return (
      <Picker.Item
        style={itemStyles}
        key={item.label}
        label={item.label}
        value={item.value}
      />
    );
  });

  return (
    <SafeAreaView style={[styles[Theme]]}>
      <Text>{label}</Text>
      <View style={[styles.Picker, style]}>
        <Picker
          mode={mode}
          prompt={prompt}
          selectedValue={value}
          onValueChange={onSelectHandler}>
          {pickerItem}
        </Picker>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create<Record<string, any>>({
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: '#9A9AA5',
    borderBottomStyle: 'solid',
  },
  Picker: {
    height: 40,
    borderRadius: 20,
    width: '100%',
    justifyContent: 'center',
  },
});
