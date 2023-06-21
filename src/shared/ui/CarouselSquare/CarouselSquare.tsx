import {View, StyleSheet} from 'react-native';
import React, {ComponentType, memo, MemoExoticComponent} from 'react';
import {useSharedValue} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {windowWidth} from '@src/app/styles/GlobalStyle';
import {StyleType} from '@src/shared/types/types';
import {horizontalScale} from '@src/shared/lib/Metrics';
import Pagination from './Pagination';

const PAGE_WIDTH = windowWidth;

interface CarousalSquareProps {
  data: Array<Record<string, any>>;
  Component: ComponentType<any> | MemoExoticComponent<any>;
  isLandscape?: boolean;
  itemStyle?: StyleType;
  carouselHeight?: number;
  withPagination?: boolean;
}

export const CarouselSquare = memo((props: CarousalSquareProps) => {
  const {
    data,
    Component,
    isLandscape,
    itemStyle,
    carouselHeight,
    withPagination = false,
  } = props;

  const progressValue = useSharedValue<number>(0);
  const baseOptions = {
    vertical: false,
    width: isLandscape ? PAGE_WIDTH : PAGE_WIDTH * 0.6,
    height: PAGE_WIDTH * 0.6,
  };
  return (
    <GestureHandlerRootView>
      <View style={[styles.container]}>
        {!!progressValue && withPagination && (
          <View style={styles.paginationWrapper}>
            {data.map((_, index) => {
              return (
                <Pagination
                  animValue={progressValue}
                  index={index}
                  key={index}
                  length={data.length}
                />
              );
            })}
          </View>
        )}
        <Carousel
          {...baseOptions}
          loop
          style={{
            width: isLandscape ? PAGE_WIDTH : PAGE_WIDTH,
            height: carouselHeight || undefined,
          }}
          pagingEnabled={true}
          snapEnabled={true}
          autoPlay={false}
          autoPlayInterval={1500}
          onProgressChange={(_, absoluteProgress) =>
            (progressValue.value = absoluteProgress)
          }
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: isLandscape ? 0.7 : 0.5,
            parallaxScrollingOffset: isLandscape ? 120 : horizontalScale(115),
            parallaxAdjacentItemScale: isLandscape ? 0.55 : 0.38,
          }}
          data={data}
          renderItem={({item}) => {
            return (
              <View style={{...itemStyle}}>
                <Component {...item} />
              </View>
            );
          }}
        />
      </View>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationWrapper: {
    flexDirection: 'row',
    marginRight: 'auto',
    top: 35,
  },
});
