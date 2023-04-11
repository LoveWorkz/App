import React, {ReactElement} from 'react';
import LinearGradient from 'react-native-linear-gradient';

import {StyleType} from '@src/shared/types/types';

interface GradientProps {
  children?: ReactElement;
  style?: StyleType;
}

export const Gradient = (props: GradientProps) => {
  const {children, style} = props;

  return (
    <LinearGradient
      style={style}
      colors={['#8CBBE9', '#ECB7FF']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}>
      {children}
    </LinearGradient>
  );
};
