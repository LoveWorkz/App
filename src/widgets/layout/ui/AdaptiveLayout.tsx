import React, {ReactElement, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {layoutStyles} from './Layout';

interface AdaptiveLayoutProps {
  isGradient: boolean;
  children: ReactElement;
  backgroundColor: string;
  deleteBottomPadding?: boolean;
  paddingBottom: number;
  marginTop: number;
  deleteGlobalPadding: boolean;
  globalPadding: number;
}

const AdaptiveLayout = (props: AdaptiveLayoutProps) => {
  const {
    isGradient,
    children,
    backgroundColor,
    deleteBottomPadding,
    paddingBottom,
    marginTop,
    deleteGlobalPadding,
    globalPadding,
  } = props;

  // Shared value for opacity
  const opacity = useSharedValue(0);

  // React to changes in isGradient to animate opacity
  useEffect(() => {
    opacity.value = withTiming(isGradient ? 1 : 0, {
      duration: 200, // Animation duration in milliseconds
    });
  }, [isGradient, opacity]);

  // Animated style for the gradient
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View
      style={[
        layoutStyles.layout,
        {
          backgroundColor: isGradient ? 'transparent' : backgroundColor,
          paddingBottom: deleteBottomPadding ? 0 : paddingBottom,
          paddingTop: marginTop,
          padding: deleteGlobalPadding ? 0 : globalPadding,
        },
      ]}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <Gradient isFlex />
      </Animated.View>
      {children}
    </View>
  );
};

export default AdaptiveLayout;
