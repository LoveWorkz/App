import React, {memo} from 'react';
import {StyleSheet, Animated, View} from 'react-native';
import {Extrapolate} from 'react-native-reanimated';

import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';

interface PaginationProps<T = any> {
  data: T[];
  scrollX: Animated.Value;
  itemWidth: number;
  isSmallDotPagination?: boolean;
  paginationColor?: string;
}

const Pagination = (props: PaginationProps) => {
  const {data, scrollX, itemWidth, isSmallDotPagination, paginationColor} =
    props;
  const colors = useColors();

  let width = 18;
  let activeWidth = 20;

  if (isSmallDotPagination) {
    width = 6;
    activeWidth = 25;
  }

  return (
    <View style={styles.pegination}>
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
            isSmallDotPagination
              ? colors.primaryTextColor
              : paginationColor || colors.red,
            colors.primaryTextColor,
          ],
          extrapolate: Extrapolate.CLAMP,
        });

        return (
          <Animated.View
            key={i.toString()}
            style={[
              styles.dot,
              // eslint-disable-next-line react-native/no-inline-styles
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
    </View>
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
