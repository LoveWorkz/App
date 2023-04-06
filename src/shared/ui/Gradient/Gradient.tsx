import React, {ReactElement} from 'react';
import LinearGradient from 'react-native-linear-gradient';

interface GradientProps {
  children?: ReactElement;
  style?:
    | Record<string, string | number | object>
    | Record<string, string | number | object>[];
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
