import React, {memo} from 'react';
import {DimensionValue, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {moderateScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  SkeletonPlaceholderBorderRadius?: number;
  backgroundColor?: string;
  highlightColor?: string;
}

export const Skeleton = (props: SkeletonProps) => {
  const {
    width,
    height,
    borderRadius,
    SkeletonPlaceholderBorderRadius,
    highlightColor,
    backgroundColor,
  } = props;

  const colors = useColors();

  return (
    <View>
      <SkeletonPlaceholder
        backgroundColor={backgroundColor || colors.skeletonColor}
        highlightColor={highlightColor || colors.skeletonHighlightColor}
        borderRadius={moderateScale(SkeletonPlaceholderBorderRadius || 4)}>
        <View
          style={{
            width: width as DimensionValue,
            height: height as DimensionValue,
            borderRadius: moderateScale(borderRadius || 0),
          }}
        />
      </SkeletonPlaceholder>
    </View>
  );
};

export default memo(Skeleton);
