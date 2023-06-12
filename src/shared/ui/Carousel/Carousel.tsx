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
    <SafeAreaView>
      <View>
        {isTopPagination && itemWidth && (
          <Pagination itemWidth={itemWidth} scrollX={scrollX} data={data} />
        )}
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        pagingEnabled
        renderItem={({item}) => (
          <SafeAreaView style={[itemStyle, {width: itemWidth}]}>
            <Component {...item} />
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
      {isBottomPagination && itemWidth && (
        <Pagination itemWidth={itemWidth} scrollX={scrollX} data={data} />
      )}
    </SafeAreaView>
  );
};
