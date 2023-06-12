import React, {memo} from 'react';
import {SafeAreaView, StyleSheet, Animated} from 'react-native';
import {Extrapolate} from 'react-native-reanimated';

import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';

interface PaginationProps {
  data: Record<string, string | number>[];
  scrollX: Animated.Value;
  itemWidth: number;
}

const Pagination = (props: PaginationProps) => {
  const {data, scrollX, itemWidth} = props;
  const colors = useColors();

  const width = 6;
  const activeWidth = 25;

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

        return (
          <Animated.View
            key={i.toString()}
            style={[
              styles.dot,
              {
                height: width,
                width: dotWidth,
                backgroundColor: colors.primaryTextColor,
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
    borderRadius: moderateScale(5),
    marginHorizontal: horizontalScale(3),
  },
});

export default memo(Pagination);
