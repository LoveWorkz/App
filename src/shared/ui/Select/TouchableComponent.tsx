import React, {memo} from 'react';
import {Pressable, View, StyleSheet, SafeAreaView} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {ArrowDownIcon} from '@src/shared/assets/icons/ArrowDown';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {StyleType} from '@src/shared/types/types';
import {useColors} from '@src/app/providers/colorsProvider';
import {globalStyles} from '@src/app/styles/GlobalStyle';

export enum SelectTheme {
  CLEAR = 'clear',
  UNDERLINE = 'underline',
  OUTLINE = 'outline',
}

interface TouchableComponentProps {
  setIsVisible: (visible: boolean) => void;
  value: string;
  selectedValueStyle?: StyleType;
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
  const colors = useColors();

  const onSelectOpenHandler = () => {
    setIsVisible(true);
  };

  return (
    <SafeAreaView style={{...globalStyles.simpleShadowOpacity}}>
      {label && (
        <AppText
          style={[styles.label, {...selectedValueStyle}]}
          size={TextSize.LEVEL_2}
          weight={'600'}
          text={label}
        />
      )}
      <Pressable
        style={[styles.wrapper, styles[theme]]}
        onPress={onSelectOpenHandler}>
        <View>
          <AppText style={selectedValueStyle} text={value} />
        </View>
        <SvgXml
          xml={ArrowDownIcon}
          stroke={colors.primaryTextColor}
          style={styles.icon}
        />
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
  outline: {
    backgroundColor: 'white',
    height: 40,
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
  },
  wrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 8,
  },
  label: {
    marginBottom: 5,
  },
  icon: {
    height: 15,
    width: 15,
  },
});

export const Wrapper = memo(TouchableComponent);
