import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import {getStarIcon} from '@src/shared/assets/icons/StarGradient';
import {ColorType} from '@src/app/styles/themeStyle';

interface PaginationDotsProps {
  currentIndex: number;
  count: number;
  isWhite?: boolean;
  withLastIcon?: boolean;
}

const getColor = (
  currentIndex: number,
  index: number,
  colors: ColorType,
  isWhite?: boolean,
) => {
  if (isWhite) {
    return colors.white;
  }
  return currentIndex === index ? colors.lavenderBlue : colors.primaryTextColor;
};

const Pagination = (props: PaginationDotsProps) => {
  const {count, currentIndex, isWhite, withLastIcon = false} = props;
  const activeOpacity = 1;
  const inactiveOpacity = 0.2;
  const colors = useColors();

  return (
    <View style={styles.dotsWrapper}>
      {Array.from({length: count}, (_, index) => {
        const opacity =
          currentIndex === index ? activeOpacity : inactiveOpacity;

        return (
          <View
            key={index.toString()}
            style={[
              styles.dot,
              {
                backgroundColor: getColor(currentIndex, index, colors, isWhite),
                opacity: opacity,
              },
            ]}
          />
        );
      })}
      {withLastIcon && (
        <SvgXml xml={getStarIcon(isWhite)} style={styles.icon} />
      )}
    </View>
  );
};

export default memo(Pagination);

const styles = StyleSheet.create({
  dotsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
  },
  dot: {
    flexBasis: moderateScale(17),
    flexShrink: 1,
    flexGrow: 0,
    height: moderateScale(4),
    borderRadius: moderateScale(6),
    marginHorizontal: horizontalScale(3),
  },
  icon: {
    width: horizontalScale(10),
    height: horizontalScale(10),
    marginHorizontal: horizontalScale(4),
  },
});
