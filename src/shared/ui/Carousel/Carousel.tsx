import React, {
  ComponentType,
  MemoExoticComponent,
  useEffect,
  useRef,
  useState,
} from 'react';
import {FlatList, SafeAreaView, Animated, View} from 'react-native';

import {StyleType} from '@src/shared/types/types';
import Pagination from './Pagination';

interface CarouselProps {
  Component: ComponentType<any> | MemoExoticComponent<any>;
  data: Record<string, string | number>[];
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

export const Carousel = (props: CarouselProps) => {
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
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({viewableItems}: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  useEffect(() => {
    getCurrentPage?.(currentIndex);
  }, [getCurrentPage, currentIndex]);

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
          contentContainerStyle={contentContainerStyle}
          horizontal
          initialScrollIndex={initialIndex}
          showsHorizontalScrollIndicator={false}
          data={data}
          pagingEnabled
          renderItem={({item, index}) => (
            <SafeAreaView style={[itemStyle, {width: itemWidth}]}>
              <Component {...item} index={index} />
            </SafeAreaView>
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
