import React, {
  ComponentType,
  memo,
  MemoExoticComponent,
  useCallback,
} from 'react';
import Carousel from 'react-native-reanimated-carousel';
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
      const itemNumber = index + 1;

      currentElementInfo && onSwipeHandler?.(currentElementInfo, itemNumber);
    },
    [data, onSwipeHandler],
  );

  return (
    <>
      <Carousel
        defaultIndex={(defaultElement || 1) - 1}
        onSnapToItem={onSnapToItemHandler}
        style={[
          itemStyle,
          {
            marginLeft: horizontalScale(-15),
          },
        ]}
        width={windowWidth * 0.95}
        pagingEnabled={true}
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
