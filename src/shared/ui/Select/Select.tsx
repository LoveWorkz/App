import React, {memo, useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {SelectOption, StyleType} from '@src/shared/types/types';
import {verticalScale} from '@src/shared/lib/Metrics';
import {Wrapper as TouchableComponent} from './TouchableComponent';
import {PageSelect} from './PageSelect';
import {Loader, LoaderSize} from '../Loader/Loader';
import {RenderItem} from './RenderItem';
import {RadioGroup} from '../Radio/RadioGroup';

export enum SelectTheme {
  CLEAR = 'clear',
  OUTLINE = 'outline',
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
  style?: StyleType;
  isScrolling?: boolean;
}

export const Select = memo((props: SelectProps) => {
  const {
    label,
    onSelect,
    options,
    value,
    initialValue,
    prompt,
    Theme = SelectTheme.OUTLINE,
    selectedValueStyle,
    isScrolling = false,
  } = props;

  const itemHeight = verticalScale(40);

  const [visible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [flatlistRef, setFlatlistRef] = useState<null | FlatList>(null);

  const firstValue = options[0]?.value;
  const selectedDisplayValue = options.find(
    option => option.value === value,
  )?.label;

  useEffect(() => {
    onSelect?.(initialValue || firstValue);
  }, [initialValue, onSelect, firstValue]);

  useEffect(() => {
    if (options.length) {
      setIsLoading(false);
    }
  }, [options.length]);

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
    [itemHeight],
  );

  const getFlatlistRef = useCallback((ref: FlatList) => {
    setFlatlistRef(ref);
  }, []);

  const renderItem = useCallback(
    ({item}: {item: SelectOption}) => {
      return (
        <RenderItem
          item={item}
          onSelectHandler={onSelectHandler}
          selectedValue={value}
          itemHeight={itemHeight}
        />
      );
    },
    [onSelectHandler, value, itemHeight],
  );

  return (
    <View>
      <TouchableComponent
        selectedDisplayValue={selectedDisplayValue || ''}
        theme={Theme}
        label={label}
        setIsVisible={setIsVisible}
        selectedValueStyle={selectedValueStyle}
      />
      <PageSelect onClose={onCloseHandler} prompt={prompt} visible={visible}>
        {isLoading ? (
          <Loader style={styles.loader} size={LoaderSize.LARGE} />
        ) : isScrolling ? (
          <FlatList
            initialScrollIndex={0}
            getItemLayout={getItemLayout}
            ref={getFlatlistRef}
            style={styles.body}
            data={options}
            renderItem={renderItem}
            keyExtractor={item => `${item.value}`}
          />
        ) : (
          <RadioGroup
            style={styles.selectItem}
            value={value}
            data={options}
            onChange={onSelectHandler}
          />
        )}
      </PageSelect>
    </View>
  );
});

const styles = StyleSheet.create({
  body: {
    width: '100%',
  },
  selectedValue: {
    fontWeight: '800',
  },
  loader: {
    margin: 'auto',
  },
  selectItem: {
    marginBottom: verticalScale(20),
  },
});
