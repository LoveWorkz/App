import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {ArrowDownIcon} from '@src/shared/assets/icons/ArrowDown';
import {ArrowLeftIcon} from '@src/shared/assets/icons/ArrowLeft';
import {SelectOption} from '@src/shared/types/types';
import {Animation, Modal} from '../Modal/Modal';

export enum SelectTheme {
  CLEAR = 'clear',
  UNDERLINE = 'underline',
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  label?: string;
  onSelect: (value: string) => void;
  initialValue?: string;
  prompt?: string;
  Theme?: SelectTheme;
  selectedValueStyle?: Record<string, string | number>;
  mode?: 'dialog' | 'dropdown';
  style?: Record<string, string | number>;
}

export const CustomSelect = memo((props: SelectProps) => {
  const {
    label,
    onSelect,
    options,
    value,
    initialValue,
    prompt,
    Theme = SelectTheme.UNDERLINE,
    selectedValueStyle,
  } = props;

  const [visible, setIsVisible] = useState(false);

  useEffect(() => {
    onSelect?.(initialValue || options[0]?.value);
  }, [initialValue, onSelect, options]);

  const onSelectHandler = useCallback(
    (itemValue: string) => {
      onSelect?.(itemValue);
      onSelectCloseHandler();
    },
    [onSelect],
  );

  const onSelectOpenHandler = () => {
    setIsVisible(true);
  };

  const onSelectCloseHandler = () => {
    setIsVisible(false);
  };

  const items = useMemo(() => {
    return options.map(item => {
      return (
        <TouchableOpacity
          onPress={() => onSelectHandler(item.label)}
          style={styles.item}
          key={item.label}>
          <Text style={styles.itemText}>{item.label}</Text>
        </TouchableOpacity>
      );
    });
  }, [options, onSelectHandler]);

  return (
    <SafeAreaView style={[styles.select, styles[Theme]]}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={onSelectOpenHandler} style={styles.wrapper}>
        <View>
          <Text style={selectedValueStyle}>{value}</Text>
        </View>
        <SvgXml xml={ArrowDownIcon} style={styles.icon} />
      </Pressable>
      {visible && (
        <Modal
          contentStyle={styles.content}
          animationIn={Animation.SLIDEIN_UP}
          visible={visible}
          setVisible={setIsVisible}>
          {prompt ? (
            <View style={styles.header}>
              <SvgXml
                onPress={onSelectCloseHandler}
                xml={ArrowLeftIcon}
                style={styles.arrowLeft}
              />
              <Text style={styles.title}>{prompt}</Text>
            </View>
          ) : (
            <></>
          )}
          <ScrollView style={styles.body}>{items}</ScrollView>
        </Modal>
      )}
    </SafeAreaView>
  );
});

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
  wrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 8,
  },
  icon: {
    height: 15,
    width: 15,
  },
  arrowLeft: {
    height: 20,
    width: 20,
    position: 'absolute',
    left: 15,
  },
  content: {
    padding: 0,
    height: 'auto',
    maxHeight: '80%',
    alignItems: 'flex-start',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D2D3',
    borderBottomStyle: 'solid',
  },
  body: {
    width: '100%',
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
  },
  item: {
    paddingVertical: 15,
    position: 'relative',
    left: 15,
  },
  itemText: {
    fontSize: 18,
  },
});
