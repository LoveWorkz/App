import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {ShareIcon} from '@src/shared/assets/icons/Share';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';

export const CategoryDetailsHeaderRight = () => {
  const colors = useColors();

  return (
    <View style={styles.CategoryDetailsHeaderRight}>
      <SvgXml
        xml={ShareIcon}
        stroke={colors.primaryTextColor}
        style={styles.icon}
      />
    </View>
  );
};

export default memo(CategoryDetailsHeaderRight);

const styles = StyleSheet.create({
  CategoryDetailsHeaderRight: {},
  icon: {
    height: verticalScale(15),
    width: horizontalScale(20),
  },
});
