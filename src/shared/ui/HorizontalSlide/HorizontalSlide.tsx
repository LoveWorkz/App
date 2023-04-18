import React, {
  ComponentType,
  memo,
  MemoExoticComponent,
  useCallback,
} from 'react';
// import {FadeInRight} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

import {windowWidthMinusPaddings} from '@src/app/styles/GlobalStyle';
import {StyleType} from '@src/shared/types/types';

interface HorizontalSlideProps {
  Component: ComponentType<any> | MemoExoticComponent<any>;
  snapDirection?: 'left' | 'right';
  itemStyle?: StyleType;
  onSwipeHandler?: (param: any) => void;
  data: Array<Record<string, any>>;
  defaultElement?: number;
}

export const HorizontalSlide = memo((props: HorizontalSlideProps) => {
  const {
    Component,
    snapDirection = 'left',
    itemStyle,
    onSwipeHandler,
    data,
    defaultElement,
  } = props;

  const viewCount = 5;

  const onSnapToItemHandler = useCallback(
    (index: number) => {
      const currentElementInfo = data.find((_, i) => i === index);
      currentElementInfo && onSwipeHandler?.(currentElementInfo);
    },
    [data, onSwipeHandler],
  );

  return (
    <>
      <Carousel
        defaultIndex={(defaultElement || 1) - 1}
        onSnapToItem={onSnapToItemHandler}
        style={itemStyle}
        width={windowWidthMinusPaddings}
        pagingEnabled={true}
        mode={'horizontal-stack'}
        loop={false}
        data={data}
        modeConfig={{
          showLength: 2,
          snapDirection,
          stackInterval: 6,
        }}
        customConfig={() => ({type: 'positive', viewCount})}
        renderItem={({item}) => <Component {...item} />}
      />
    </>
  );
});
