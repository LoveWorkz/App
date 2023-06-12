import {View, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';

interface PaginationProps {
  index: number;
  length: number;
  animValue: Animated.SharedValue<number>;
}

const Pagination = (props: PaginationProps) => {
  const {animValue, index, length} = props;
  const colors = useColors();

  const width = 6;
  const activeWidth = 25;

  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [width, activeWidth, width];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [width, activeWidth, width];
    }

    const dotWidth = interpolate(
      animValue.value,
      inputRange,
      outputRange,
      Extrapolate.CLAMP,
    );

    const opacity = interpolate(
      animValue.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP,
    );

    return {
      width: dotWidth,
      opacity,
    };
  }, [animValue, index, length]);

  return (
    <View style={{height: width}}>
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: colors.primaryTextColor,
          },
          animStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    flex: 1,
    borderRadius: moderateScale(5),
    marginHorizontal: horizontalScale(3),
  },
});

export default memo(Pagination);
