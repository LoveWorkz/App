import React, {memo, useCallback, useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';

import {SelectOption, StyleType} from '@src/shared/types/types';
import {SelectTheme, Wrapper as TouchableComponent} from './TouchableComponent';
import {DialogSelect} from './DialogSelect';
import {PageSelect} from './PageSelect';
import {Loader, LoaderSize} from '../Loader/Loader';

export enum SelectMode {
  DIALOG = 'dialog',
  PAGE = 'page',
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  label?: string;
  onSelect: (value: string) => void;
  initialValue?: string;
  prompt?: string;
  Theme?: SelectTheme;
  selectedValueStyle?: StyleType;
  mode?: SelectMode;
  style?: StyleType;
}

const itemHeight = 40;

export const Select = memo((props: SelectProps) => {
  const {
    label,
    onSelect,
    options,
    value,
    initialValue,
    prompt,
    Theme = SelectTheme.UNDERLINE,
    selectedValueStyle,
    mode = SelectMode.PAGE,
  } = props;

  const [visible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [flatlistRef, setFlatlistRef] = useState<null | FlatList>(null);

  useEffect(() => {
    onSelect?.(initialValue || options[0]?.value);
  }, [initialValue, onSelect, options]);

  useEffect(() => {
    if (options.length) {
      setIsLoading(false);
    }
  }, [options]);

  useEffect(() => {
    if (!flatlistRef) {
      return;
    }

    const scrollToIndex = () => {
      const currentIndex = options.findIndex(elem => elem.value === value);

      if (currentIndex) {
        flatlistRef.scrollToIndex({
          animated: false,
          index: currentIndex,
        });
      }
    };
    const timerId = setTimeout(scrollToIndex);
    return () => clearTimeout(timerId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, flatlistRef]);

  const onSelectHandler = useCallback(
    (itemValue: string) => {
      onSelect?.(itemValue);
      onCloseHandler();
    },
    [onSelect],
  );

  const onCloseHandler = () => {
    setIsVisible(false);
  };

  const getItemLayout = useCallback(
    (_: SelectOption[] | null | undefined, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [],
  );

  const getFlatlistRef = useCallback((ref: FlatList) => {
    setFlatlistRef(ref);
  }, []);

  const renderItem = useCallback(
    ({item}: {item: SelectOption}) => {
      return (
        <Pressable
          onPress={() => onSelectHandler(item.value)}
          style={styles.item}
          key={item.label}>
          <Text
            style={[
              styles.itemText,
              value === item.value ? styles.selectedValue : '',
            ]}>
            {item.label}
          </Text>
        </Pressable>
      );
    },
    [onSelectHandler, value],
  );

  let select;

  switch (mode) {
    case SelectMode.DIALOG:
      select = (
        <DialogSelect
          onClose={onCloseHandler}
          prompt={prompt}
          visible={visible}>
          {isLoading ? (
            <View style={styles.loaderWrapper}>
              <Loader style={styles.loader} size={LoaderSize.LARGE} />
            </View>
          ) : (
            <FlatList
              initialScrollIndex={0}
              getItemLayout={getItemLayout}
              ref={getFlatlistRef}
              style={styles.body}
              data={options}
              renderItem={renderItem}
              keyExtractor={item => item.label}
            />
          )}
        </DialogSelect>
      );
      break;
    default:
      select = (
        <PageSelect onClose={onCloseHandler} prompt={prompt} visible={visible}>
          {isLoading ? (
            <Loader style={styles.loader} size={LoaderSize.LARGE} />
          ) : (
            <FlatList
              initialScrollIndex={0}
              getItemLayout={getItemLayout}
              ref={getFlatlistRef}
              style={styles.body}
              data={options}
              renderItem={renderItem}
              keyExtractor={item => `${item.label}`}
            />
          )}
        </PageSelect>
      );
  }

  return (
    <View>
      <TouchableComponent
        theme={Theme}
        label={label}
        value={value}
        setIsVisible={setIsVisible}
        selectedValueStyle={selectedValueStyle}
      />
      {select}
    </View>
  );
});

const styles = StyleSheet.create<Record<string, any>>({
  body: {
    width: '100%',
  },
  item: {
    height: itemHeight,
    justifyContent: 'center',
    paddingLeft: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D2D3',
    borderBottomStyle: 'solid',
  },
  itemText: {
    fontSize: 16,
  },
  selectedValue: {
    fontWeight: '800',
  },
  loaderWrapper: {
    width: '100%',
  },
  loader: {
    margin: 'auto',
  },
});
