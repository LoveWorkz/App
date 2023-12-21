import React, {memo} from 'react';
import {SafeAreaView, StyleSheet, Animated} from 'react-native';
import {Extrapolate} from 'react-native-reanimated';

import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';

interface PaginationProps {
  data: Record<string, string | number>[];
  scrollX: Animated.Value;
  itemWidth: number;
  isSmallDotPagination?: boolean;
}

const Pagination = (props: PaginationProps) => {
  const {data, scrollX, itemWidth, isSmallDotPagination} = props;
  const colors = useColors();

  let width = 18;
  let activeWidth = 20;

  if (isSmallDotPagination) {
    width = 6;
    activeWidth = 25;
  }

  return (
    <SafeAreaView style={styles.pegination}>
      {data.map((_, i) => {
        const inputRange = [
          (i - 1) * itemWidth,
          i * itemWidth,
          (i + 1) * itemWidth,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [width, activeWidth, width],
          extrapolate: Extrapolate.CLAMP,
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: Extrapolate.CLAMP,
        });

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: [
            colors.primaryTextColor,
            isSmallDotPagination ? colors.primaryTextColor : 'red',
            colors.primaryTextColor,
          ],
          extrapolate: Extrapolate.CLAMP,
        });

        return (
          <Animated.View
            key={i.toString()}
            style={[
              styles.dot,
              {
                height: isSmallDotPagination ? width : 5,
                width: dotWidth,
                backgroundColor,
                opacity,
              },
            ]}
          />
        );
      })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pegination: {
    flexDirection: 'row',
  },
  dot: {
    borderRadius: moderateScale(10),
    marginHorizontal: horizontalScale(3),
  },
});

export default memo(Pagination);
