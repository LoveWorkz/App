import React, {memo} from 'react';
import {Pressable, Text, View, StyleSheet, SafeAreaView} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {ArrowDownIcon} from '@src/shared/assets/icons/ArrowDown';

export enum SelectTheme {
  CLEAR = 'clear',
  UNDERLINE = 'underline',
}

interface TouchableComponentProps {
  setIsVisible: (visible: boolean) => void;
  value: string;
  selectedValueStyle?: Record<string, string | number>;
  label?: string;
  theme?: SelectTheme;
}

export const TouchableComponent = memo((props: TouchableComponentProps) => {
  const {
    value,
    setIsVisible,
    selectedValueStyle,
    label,
    theme = SelectTheme.CLEAR,
  } = props;

  const onSelectOpenHandler = () => {
    setIsVisible(true);
  };

  return (
    <SafeAreaView style={[styles[theme]]}>
      <Text>{label}</Text>
      <Pressable onPress={onSelectOpenHandler} style={styles.wrapper}>
        <View>
          <Text style={selectedValueStyle}>{value}</Text>
        </View>
        <SvgXml xml={ArrowDownIcon} style={styles.icon} />
      </Pressable>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create<Record<string, any>>({
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: '#9A9AA5',
    borderBottomStyle: 'solid',
  },
  wrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 8,
  },
  icon: {
    height: 15,
    width: 15,
  },
});

export const Wrapper = memo(TouchableComponent);
