import React, {
  ComponentType,
  MemoExoticComponent,
  useEffect,
  useRef,
  useState,
} from 'react';
import {FlatList, Animated, View} from 'react-native';

import {StyleType} from '@src/shared/types/types';
import Pagination from './Pagination';

interface CarouselProps<T = Record<string, string | number>> {
  Component: ComponentType<any> | MemoExoticComponent<any>;
  data: T[];
  getCurrentPage?: (currentPage: number) => void;
  isBottomPagination?: boolean;
  isTopPagination?: boolean;
  itemStyle?: StyleType;
  itemWidth?: number;
  initialIndex?: number;
  contentContainerStyle?: StyleType;
  paginationStyle?: StyleType;
  isSmallDotPagination?: boolean;
  style?: StyleType;
  paginationColor?: string;
}

export const Carousel = <T = {}>(props: CarouselProps<T>) => {
  const {
    Component,
    data,
    getCurrentPage,
    isBottomPagination = false,
    isTopPagination = false,
    itemStyle,
    itemWidth,
    initialIndex,
    contentContainerStyle,
    paginationStyle,
    isSmallDotPagination = true,
    style,
    paginationColor,
  } = props;

  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList | null>(null);

  const viewableItemsChanged = useRef(({viewableItems}: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  useEffect(() => {
    getCurrentPage?.(currentIndex);
  }, [getCurrentPage, currentIndex]);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < data.length) {
      slidesRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <>
      <View>
        {isTopPagination && itemWidth && (
          <View style={paginationStyle}>
            <Pagination
              paginationColor={paginationColor}
              isSmallDotPagination={isSmallDotPagination}
              itemWidth={itemWidth}
              scrollX={scrollX}
              data={data}
            />
          </View>
        )}
      </View>
      <View style={style}>
        <FlatList
          onScrollToIndexFailed={() => {}}
          contentContainerStyle={contentContainerStyle}
          horizontal
          initialScrollIndex={initialIndex}
          showsHorizontalScrollIndicator={false}
          data={data}
          pagingEnabled
          renderItem={({item, index}) => (
            <View style={[itemStyle, {width: itemWidth}]}>
              <Component {...item} index={index} handleNext={handleNext} />
            </View>
          )}
          bounces={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {
              useNativeDriver: false,
            },
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>
      {isBottomPagination && itemWidth && (
        <View style={paginationStyle}>
          <Pagination
            paginationColor={paginationColor}
            isSmallDotPagination={isSmallDotPagination}
            itemWidth={itemWidth}
            scrollX={scrollX}
            data={data}
          />
        </View>
      )}
    </>
  );
};
