import React, {memo, useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {SelectOption, StyleType} from '@src/shared/types/types';
import {verticalScale} from '@src/shared/lib/Metrics';
import {TouchableComponent} from './TouchableComponent';
import {PageSelect} from './PageSelect';
import {RenderItem} from './RenderItem';

export enum SelectTheme {
  CLEAR = 'clear',
  OUTLINE = 'outline',
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  label?: string;
  onSelect?: (value: string) => void;
  initialValue?: string;
  prompt?: string;
  Theme?: SelectTheme;
  selectedValueStyle?: StyleType;
  style?: StyleType;
  isScrolling?: boolean;
  isLoading?: boolean;
  closingTime?: number;
  setIsPopupVisible?: (isVisible: boolean) => void;
  isPopupVisible?: boolean;
  error?: string | null;
  isCountry?: boolean;
  onClose?: () => void;
  lang?: boolean;
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
    isLoading = false,
    closingTime,
    isPopupVisible,
    setIsPopupVisible,
    isCountry,
    error,
    onClose,
    lang,
  } = props;

  const itemHeight = verticalScale(60);

  const [visible, setIsVisible] = useState(false);
  const [flatlistRef, setFlatlistRef] = useState<null | FlatList>(null);

  const firstValue = options[0]?.value;
  const selectedDisplayValue = options.find(
    option => option.value === value,
  )?.label;

  useEffect(() => {
    onSelect?.(initialValue || firstValue);
  }, [initialValue, onSelect, firstValue]);

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

  const onCloseHandler = useCallback(() => {
    if (setIsPopupVisible) {
      setIsPopupVisible(false);

      return;
    }

    onClose?.();

    setIsVisible(false);
  }, [onClose, setIsPopupVisible]);

  const onSelectHandler = useCallback(
    (itemValue: string) => {
      // Will be removed later
      if (lang && itemValue !== 'en') {
        return;
      }

      onSelect?.(itemValue);

      // using setTimeout for a bit delay
      const timerId = setTimeout(() => {
        onCloseHandler();

        if (timerId) {
          clearTimeout(timerId);
        }
      }, closingTime || 150);
    },
    [onSelect, onCloseHandler, closingTime],
  );

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
      const lastElement = options[options.length - 1];
      const isLastItem = lastElement.value === item.value;

      return (
        <RenderItem
          isCountry={isCountry}
          isLastItem={isLastItem}
          item={item}
          onSelectHandler={onSelectHandler}
          selectedValue={value}
          itemHeight={itemHeight}
        />
      );
    },
    [onSelectHandler, value, itemHeight, options, isCountry],
  );

  const onSelectOpenHandler = useCallback(() => {
    setIsVisible(true);
  }, []);

  return (
    <View>
      {Theme === SelectTheme.OUTLINE && (
        <TouchableComponent
          error={error}
          isLoading={isLoading}
          selectedDisplayValue={selectedDisplayValue || ''}
          label={label}
          onSelectOpenHandler={onSelectOpenHandler}
          selectedValueStyle={selectedValueStyle}
        />
      )}
      <PageSelect
        onClose={onCloseHandler}
        prompt={prompt}
        visible={isPopupVisible ?? visible}>
        {isScrolling ? (
          <FlatList
            initialScrollIndex={0}
            getItemLayout={
              getItemLayout as
                | ((
                    data: ArrayLike<any> | null | undefined,
                    index: number,
                  ) => {length: number; offset: number; index: number})
                | undefined
            }
            ref={getFlatlistRef}
            style={styles.body}
            data={options}
            renderItem={renderItem}
            keyExtractor={item => `${item.value}`}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            scrollEnabled={false}
            style={styles.body}
            data={options}
            renderItem={renderItem}
            keyExtractor={item => `${item.value}`}
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
