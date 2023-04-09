import {StyleSheet, View, useWindowDimensions} from 'react-native';
import React, {
  ComponentType,
  MemoExoticComponent,
  RefObject,
  useState,
} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  useAnimatedRef,
} from 'react-native-reanimated';

interface CarousalSquareProps {
  data: Array<Record<string, any>>;
  Component: ComponentType<any> | MemoExoticComponent<any>;
  isLandscape?: boolean;
}

export const CarouselSquare = (props: CarousalSquareProps) => {
  const {data, Component, isLandscape = true} = props;

  const scrollViewRef = useAnimatedRef() as RefObject<any>;
  const [newData] = useState([
    {key: 'spacer-left', start: true},
    ...data,
    {key: 'spacer-right', end: true},
  ]);
  const {width} = useWindowDimensions();
  const SIZE = width * (isLandscape ? 0.6 : 0.3);
  const SPACER = (width - SIZE) / (isLandscape ? 2 : 4);

  const x = useSharedValue(0);
  const offSet = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  return (
    <View>
      {/* <Pagination scrollX={scrollX} data={data} /> */}
      <Animated.ScrollView
        snapToAlignment="center"
        ref={scrollViewRef}
        onScroll={onScroll}
        onMomentumScrollEnd={e => {
          offSet.value = e.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SIZE}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}>
        {newData.map((item, index) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const style = useAnimatedStyle(() => {
            const scale = interpolate(
              x.value,
              [
                (index - 3) * SPACER,
                (index - 2) * SIZE,
                (index - 1) * SIZE,
                index * SIZE,
              ],
              [0.8, 0.8, 1, 0.8],
            );
            return {
              transform: [{scale}],
            };
          });

          if (item.start || item.end) {
            return <View style={{width: SPACER}} key={index} />;
          }
          return (
            <View style={{width: SIZE}} key={index}>
              <Animated.View style={[styles.componentWrapper, style]}>
                <Component {...item} />
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  componentWrapper: {
    overflow: 'hidden',
  },
});
