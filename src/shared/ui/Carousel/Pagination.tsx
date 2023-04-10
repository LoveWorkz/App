import React, {memo} from 'react';
import {SafeAreaView, StyleSheet, Animated} from 'react-native';

import {useColors} from '@src/app/providers/colorsProvider';

interface PaginationProps {
  data: Record<string, string | number>[];
  scrollX: Animated.Value;
  itemWidth: number;
}

const Pagination = (props: PaginationProps) => {
  const {data, scrollX, itemWidth} = props;
  const colors = useColors();

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
          outputRange: [8, 25, 8],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i.toString()}
            style={[
              styles.dot,
              {
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
    height: 5,
    borderRadius: 5,
    backgroundColor: 'black',
    marginHorizontal: 3,
  },
});

export const Wrapper = memo(Pagination);
