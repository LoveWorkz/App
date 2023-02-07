import React, {
  ComponentType,
  MemoExoticComponent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  SafeAreaView,
  useWindowDimensions,
  Animated,
} from 'react-native';

import {globalPadding} from '@src/app/styles';
import {Wrapper as Pagination} from './Pagination';

interface CarouselItemProps {
  children: ReactElement;
}

const CarouselItem = (props: CarouselItemProps) => {
  const {children} = props;

  const {width} = useWindowDimensions();

  const paddings = globalPadding + globalPadding;

  return (
    <SafeAreaView style={[{width: width - paddings}]}>{children}</SafeAreaView>
  );
};

interface CarouselProps {
  Component: ComponentType | MemoExoticComponent<any>;
  data: Record<string, string | number>[];
  getCurrentPage?: (currentPage: number) => void;
  isPagination?: boolean;
}

export const Carousel = (props: CarouselProps) => {
  const {Component, data, getCurrentPage, isPagination = true} = props;

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
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        pagingEnabled
        renderItem={({item}) => (
          <CarouselItem>
            <Component {...item} />
          </CarouselItem>
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
      {isPagination && <Pagination scrollX={scrollX} data={data} />}
    </SafeAreaView>
  );
};
