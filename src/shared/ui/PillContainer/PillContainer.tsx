import React, {memo, ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';

import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';
import {StyleType} from '@src/shared/types/types';

interface PillContainerProps {
  children: ReactElement;
  style?: StyleType;
}

export const PillContainer = (props: PillContainerProps) => {
  const {children, style} = props;

  const colors = useColors();

  return (
    <View>
      <View style={[styles.category, style]}>
        <View style={[styles.layout, {backgroundColor: colors.white}]} />

        {children}
      </View>
    </View>
  );
};

const categoryBorderRadius = moderateScale(10);

const styles = StyleSheet.create({
  category: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(15),
    borderRadius: categoryBorderRadius,
    height: horizontalScale(30),
    alignSelf: 'flex-start',
  },
  layout: {
    borderRadius: categoryBorderRadius,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.1,
  },
});
