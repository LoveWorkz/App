import React, {
  ComponentType,
  memo,
  MemoExoticComponent,
  MutableRefObject,
  useCallback,
  useRef,
} from 'react';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {StyleSheet, View} from 'react-native';

import {windowWidth} from '@src/app/styles/GlobalStyle';
import {StyleType} from '@src/shared/types/types';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {getDefaultIndexForCarousel} from '@src/shared/lib/common';

interface HorizontalSlideProps {
  Component: ComponentType<any> | MemoExoticComponent<any>;
  snapDirection?: 'left' | 'right';
  itemStyle?: StyleType;
  onSwipeHandler?: (param: any, itemNumber: number) => void;
  data: Array<Record<string, any>>;
  defaultElement?: number;
  isSlideEnabled?: boolean;
  onScrollEnd?: () => void;
  spead?: number;
}

export const HorizontalSlide = memo((props: HorizontalSlideProps) => {
  const {
    Component,
    snapDirection = 'left',
    itemStyle,
    onSwipeHandler,
    data,
    defaultElement,
    isSlideEnabled = true,
    onScrollEnd,
    spead = 50,
  } = props;

  const viewCount = 5;
  const defaultIndex = getDefaultIndexForCarousel(defaultElement);

  const carouselRef = useRef() as MutableRefObject<ICarouselInstance>;
  const newSwapIndex = useRef(defaultIndex);
  const swipeStartStatus = useRef(false) as MutableRefObject<boolean>;

  const onProgressChange = useCallback(() => {
    // the logic should start working when user start swiping

    if (!swipeStartStatus.current) {
      swipeStartStatus.current = true;

      return;
    }

    const index = carouselRef.current?.getCurrentIndex();

    if (newSwapIndex.current !== index) {
      newSwapIndex.current = index;
      let timeoutId: ReturnType<typeof setTimeout>;

      timeoutId = setTimeout(() => {
        const currentElementInfo = data.find((_, i) => i === index);
        const itemNumber = index + 1;

        currentElementInfo && onSwipeHandler?.(currentElementInfo, itemNumber);

        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }, spead);
    }
  }, [onSwipeHandler, data, spead]);

  return (
    <>
      <Carousel
        ref={carouselRef}
        onProgressChange={onProgressChange}
        onScrollEnd={onScrollEnd}
        defaultIndex={defaultIndex}
        style={[
          itemStyle,
          {
            marginLeft: horizontalScale(-15),
          },
        ]}
        enabled={isSlideEnabled}
        width={windowWidth * 0.95}
        pagingEnabled={true}
        overscrollEnabled={false}
        mode={'horizontal-stack'}
        loop={false}
        data={data}
        modeConfig={{
          showLength: 2,
          snapDirection,
          stackInterval: 6,
          rotateZDeg: 20,
        }}
        customConfig={() => ({type: 'positive', viewCount})}
        renderItem={({item}) => (
          <View style={styles.wrapper}>
            <Component {...item} data={item} />
          </View>
        )}
      />
    </>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: verticalScale(30),
  },
});
