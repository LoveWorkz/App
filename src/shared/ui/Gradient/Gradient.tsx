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
  children?: ReactElement;
  style?: StyleType;
  size?: GradientSize;
}

export const Gradient = (props: GradientProps) => {
  const {children, style, size = GradientSize.LARGE} = props;

  return (
    <LinearGradient
      style={[styles.gradient, styles[size], style]}
      colors={['#83C0F8', '#847AED']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}>
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
