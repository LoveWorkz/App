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

interface HorizontalSlideProps {
  Component: ComponentType<any> | MemoExoticComponent<any>;
  snapDirection?: 'left' | 'right';
  itemStyle?: StyleType;
  onSwipeHandler?: (param: any, itemNumber: number) => void;
  data: Array<Record<string, any>>;
  defaultElement?: number;
  isSlideEnabled?: boolean;
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
  } = props;

  const viewCount = 5;

  const carouselRef = useRef() as MutableRefObject<ICarouselInstance>;
  const newSwapIndex = useRef(0);

  const onProgressChange = useCallback(() => {
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
      }, 50);
    }
  }, [onSwipeHandler, data]);

  return (
    <>
      <Carousel
        ref={carouselRef}
        onProgressChange={onProgressChange}
        defaultIndex={(defaultElement || 1) - 1}
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
            <Component {...item} />
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
