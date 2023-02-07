import React, {memo} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  Animated,
} from 'react-native';

interface PaginationProps {
  data: Record<string, string | number>[];
  scrollX: Animated.Value;
}

const Pagination = (props: PaginationProps) => {
  const {data, scrollX} = props;

  const {width} = useWindowDimensions();

  return (
    <SafeAreaView style={styles.pegination}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

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
            style={[styles.dot, {width: dotWidth, opacity}]}
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
    height: 8,
    borderRadius: 5,
    backgroundColor: 'black',
    marginHorizontal: 3,
  },
});

export const Wrapper = memo(Pagination);
