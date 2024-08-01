import React, {ReactElement} from 'react';
import LinearGradient from 'react-native-linear-gradient';

import {StyleType} from '@src/shared/types/types';
import {StyleSheet} from 'react-native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';

export enum GradientSize {
  SMALL = 'small',
  LARGE = 'large',
}

interface GradientProps {
  children?: ReactElement | ReactElement[];
  style?: StyleType;
  size?: GradientSize;
  isFlex?: boolean;
  isSoftBluePurpleGradient?: boolean;
}

export const Gradient = (props: GradientProps) => {
  const {
    children,
    style,
    size = GradientSize.LARGE,
    isFlex = false,
    isSoftBluePurpleGradient = false,
  } = props;

  const gradientColors = ['#847AED', '#83C0F8'];
  const start = isSoftBluePurpleGradient ? {x: 1, y: 1} : {x: 1, y: 0};
  const end = isSoftBluePurpleGradient ? {x: 1, y: 0} : {x: 0, y: 1};

  if (isFlex) {
    return (
      <LinearGradient
        colors={gradientColors}
        // eslint-disable-next-line react-native/no-inline-styles
        style={[styles[size], style, {flex: 1}]}
        start={start}
        end={end}
      />
    );
  }

  return (
    <LinearGradient
      style={[styles.gradient, styles[size], style]}
      colors={gradientColors}
      start={start}
      end={end}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create<Record<string, any>>({
  gradient: {
    borderRadius: moderateScale(10),
  },
  small: {
    alignSelf: 'flex-start',
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(5),
  },
});
