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

// import {View, StyleSheet} from 'react-native';
// import React, {ComponentType, memo, MemoExoticComponent} from 'react';
// import Animated, {
//   Extrapolate,
//   interpolate,
//   useAnimatedStyle,
//   useSharedValue,
// } from 'react-native-reanimated';
// import Carousel from 'react-native-reanimated-carousel';

// import {
//   windowWidth,
//   windowWidthMinusPaddings,
// } from '@src/app/styles/GlobalStyle';
// import {StyleType} from '@src/shared/types/types';

// const PAGE_WIDTH = windowWidth;

// interface CarousalSquareProps {
//   data: Array<Record<string, any>>;
//   Component: ComponentType<any> | MemoExoticComponent<any>;
//   isLandscape?: boolean;
//   itemStyle?: StyleType;
// }

// export const CarouselSquare = memo((props: CarousalSquareProps) => {
//   const {data, Component, isLandscape, itemStyle} = props;

//   const progressValue = useSharedValue<number>(0);
//   const baseOptions = {
//     vertical: false,
//     width: isLandscape ? PAGE_WIDTH : windowWidthMinusPaddings * 0.6,
//     height: windowWidthMinusPaddings * 0.6,
//     style: {
//       width: PAGE_WIDTH,
//     },
//   };

//   return (
//     <View style={[styles.container]}>
//       <Carousel
//         {...baseOptions}
//         loop
//         pagingEnabled={true}
//         snapEnabled={true}
//         autoPlay={false}
//         autoPlayInterval={1500}
//         onProgressChange={(_, absoluteProgress) =>
//           (progressValue.value = absoluteProgress)
//         }
//         mode="parallax"
//         modeConfig={{
//           parallaxScrollingScale: isLandscape ? 0.7 : 0.9,
//           parallaxScrollingOffset: isLandscape ? 120 : 170,
//           parallaxAdjacentItemScale: isLandscape ? 0.6 : 0.7,
//         }}
//         data={data}
//         renderItem={({item}) => {
//           return (
//             <View style={{...itemStyle}}>
//               <Component {...item} />
//             </View>
//           );
//         }}
//       />
//       {/* {!!progressValue && (
//         <View style={styles.paginationItems}>
//           {data.map((_, index) => {
//             return (
//               <PaginationItem
//                 animValue={progressValue}
//                 index={index}
//                 key={index}
//                 isRotate={false}
//                 length={colors.length}
//               />
//             );
//           })}
//         </View>
//       )} */}
//     </View>
//   );
// });

// const styles = StyleSheet.create({
//   container: {
//     // alignItems: 'center',
//     backgroundColor: 'green',
//   },
//   paginationItems: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: 100,
//     alignSelf: 'center',
//   },
// });
