import React, {useCallback, useEffect, useState} from 'react';
import {
  Modal,
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
import {globalPadding} from '@src/app/styles';
import {ArrowLeftIcon} from '@src/shared/assets/icons/ArrowLeft';

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
  Theme?: SelectTheme;
  selectedValueStyle?: Record<string, string | number>;
  mode?: 'dialog' | 'dropdown';
  style?: Record<string, string | number>;
}

export const CustomSelect = (props: SelectProps) => {
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

  const items = options.map(item => {
    return (
      <TouchableOpacity
        onPress={() => onSelectHandler(item.label)}
        style={styles.item}
        key={item.label}>
        <Text style={styles.itemText}>{item.label}</Text>
      </TouchableOpacity>
    );
  });

  return (
    <SafeAreaView style={[styles.select, styles[Theme]]}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={onSelectOpenHandler} style={styles.wrapper}>
        <View>
          <Text style={selectedValueStyle}>{value}</Text>
        </View>
        <SvgXml xml={ArrowDownIcon} style={styles.icon} />
      </Pressable>
      <Modal animationType="fade" transparent={true} visible={visible}>
        <Pressable onPress={onSelectCloseHandler} style={styles.overlay}>
          <View style={styles.content}>
            {prompt && (
              <View style={styles.header}>
                <SvgXml
                  onPress={onSelectCloseHandler}
                  xml={ArrowLeftIcon}
                  style={styles.arrowLeft}
                />
                <Text style={styles.title}>{prompt}</Text>
              </View>
            )}
            <View>
              <ScrollView>
                <View style={styles.body}>{items}</View>
              </ScrollView>
            </View>
          </View>
        </Pressable>
      </Modal>
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
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000AA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: globalPadding,
  },
  content: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  body: {
    width: '100%',
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#9A9AA5',
    borderBottomStyle: 'solid',
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D2D3',
    borderBottomStyle: 'solid',
  },
  itemText: {
    fontSize: 18,
  },
});
