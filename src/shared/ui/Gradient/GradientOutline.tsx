import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import {ReactChildren} from 'react-native-toast-message';

import {StyleType} from '@src/shared/types/types';
import {moderateScale} from '@src/shared/lib/Metrics';
import {Gradient} from './Gradient';

interface GradientOutlineProps {
  children?: ReactChildren | ReactElement[];
  style?: StyleType;
  contentStyle?: StyleType;
  borderWeight?: number;
  radius?: number;
}

export const GradientOutline = (props: GradientOutlineProps) => {
  const {children, style, contentStyle, borderWeight = 1, radius = 0} = props;

  return (
    <Gradient
      style={[
        style as Record<string, string | number | object | undefined>,
        {...style, borderRadius: moderateScale(radius)},
      ]}>
      <View
        style={[
          styles.content,
          {
            margin: borderWeight,
            borderRadius: moderateScale(radius),
          },
          contentStyle,
        ]}>
        {children}
      </View>
    </Gradient>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
