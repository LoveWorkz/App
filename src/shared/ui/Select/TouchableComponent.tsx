import React, {memo} from 'react';
import {Pressable, View, StyleSheet, SafeAreaView} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {ArrowDownIcon} from '@src/shared/assets/icons/ArrowDown';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

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
      {label && (
        <AppText
          style={selectedValueStyle}
          size={TextSize.LEVEL_2}
          weight={'600'}
          text={label}
        />
      )}
      <Pressable onPress={onSelectOpenHandler} style={styles.wrapper}>
        <View>
          <AppText style={selectedValueStyle} text={value} />
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
