import React, {memo, useCallback, useMemo, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {windowWidth} from '@src/app/styles/GlobalStyle';
import {horizontalScale} from '@src/shared/lib/Metrics';
import {StyleType} from '@src/shared/types/types';
import {getDefaultIndexForCarousel} from '@src/shared/lib/common';
import Pagination from './Pagination';

type ItemType = Record<string, any>;

interface CarouselSquareProps {
  data: Array<ItemType>;
  Component: React.ComponentType<any>;
  mode?: 'expanded' | 'standard' | 'multiple';
  itemStyle?: StyleType;
  carouselHeight?: number;
  withPagination?: boolean;
  withTopPagination?: boolean;
  loop?: boolean;
  paginationStyle?: StyleType;
  paginationDotColor?: string;
  onSwipeHandler?: (param: any, itemNumber: number) => void;
  defaultElement?: number;
}

const PAGE_WIDTH = windowWidth;

export const CarouselSquare = memo(
  ({
    data,
    Component,
    mode = 'standard',
    itemStyle = {},
    carouselHeight,
    withPagination = false,
    withTopPagination = false,
    loop = true,
    paginationStyle = {},
    paginationDotColor,
    onSwipeHandler,
    defaultElement,
  }: CarouselSquareProps) => {
    const isScrolling = useRef(false);
    const progressValue = useSharedValue(0);

    const defaultIndex = getDefaultIndexForCarousel(defaultElement);

    const handleProgressChange = (_: number, absoluteProgress: number) => {
      const decimalPart = absoluteProgress - Math.floor(absoluteProgress);
      const value = parseFloat(decimalPart.toFixed(2));

      isScrolling.current = value * 100 <= 90 && value * 100 >= 10;
      progressValue.value = absoluteProgress;
    };

    const width =
      mode === 'standard' || mode === 'expanded'
        ? PAGE_WIDTH
        : PAGE_WIDTH * 0.6;

    const getModeConfig = () => {
      switch (mode) {
        case 'standard':
          return {
            parallaxScrollingScale: 0.7,
            parallaxScrollingOffset: 120,
            parallaxAdjacentItemScale: 0.55,
          };
        case 'expanded':
          return {
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 30,
            parallaxAdjacentItemScale: 0.9,
          };
        case 'multiple':
          return {
            parallaxScrollingScale: 0.5,
            parallaxScrollingOffset: horizontalScale(108),
            parallaxAdjacentItemScale: 0.38,
          };
        default:
          return {
            parallaxScrollingScale: 0.7,
            parallaxScrollingOffset: 120,
            parallaxAdjacentItemScale: 0.55,
          };
      }
    };

    const renderPagination = () =>
      data.map((_, index) => (
        <Pagination
          dotColor={paginationDotColor}
          animValue={progressValue}
          index={index}
          key={index}
          length={data.length}
        />
      ));

    const renderItem = useCallback(
      ({item}: {item: ItemType}) => (
        <View style={itemStyle}>
          <Component isActionDisabled={isScrolling} {...item} />
        </View>
      ),
      [isScrolling, itemStyle],
    );

    const onScrollEnd = useCallback(
      (index: number) => {
        const currentElement = data.find((_, i) => i === index);
        if (currentElement) {
          onSwipeHandler?.(currentElement, index);
        }
      },
      [onSwipeHandler],
    );

    const style = useMemo(() => {
      return {
        width: PAGE_WIDTH,
        height: carouselHeight || windowWidth * 0.6,
      };
    }, [carouselHeight]);

    return (
      <View style={styles.container}>
        {withPagination && (
          <View style={[styles.paginationWrapper, paginationStyle]}>
            {renderPagination()}
          </View>
        )}
        <Carousel
          defaultIndex={defaultIndex}
          width={width}
          height={PAGE_WIDTH * 0.6}
          style={style}
          loop={loop}
          pagingEnabled
          snapEnabled
          autoPlay={false}
          autoPlayInterval={1500}
          onScrollEnd={onScrollEnd}
          mode="parallax"
          modeConfig={getModeConfig()}
          data={data}
          renderItem={renderItem}
          onProgressChange={handleProgressChange}
        />
        {withTopPagination && (
          <View style={[styles.bottomPaginationWrapper, paginationStyle]}>
            {renderPagination()}
          </View>
        )}
      </View>
    );
  },
);

const paginStyle: Record<string, string> = {
  flexDirection: 'row',
  position: 'absolute',
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationWrapper: {
    ...paginStyle,
    top: 35,
    alignSelf: 'flex-start',
  },
  bottomPaginationWrapper: {
    ...paginStyle,
    bottom: 0,
    justifyContent: 'center',
  },
});
