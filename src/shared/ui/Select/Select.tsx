import React, {useCallback} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';

interface PikerItem {
  label: string;
  value: string;
}

interface SelectProps {
  options: PikerItem[];
  value: string;
  label: string;
  onSelect: (value: string) => void;
}

export const Select = (props: SelectProps) => {
  const {label, onSelect, options, value} = props;

  const onSelectHandler = useCallback(
    (itemValue: string) => {
      onSelect?.(itemValue);
    },
    [onSelect],
  );

  const pickerItem = options.map(item => {
    return (
      <Picker.Item key={item.label} label={item.label} value={item.value} />
    );
  });

  return (
    <SafeAreaView style={styles.Select}>
      <Text>{label}</Text>
      <View style={styles.Picker}>
        <Picker selectedValue={value} onValueChange={onSelectHandler}>
          {pickerItem}
        </Picker>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Select: {
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
