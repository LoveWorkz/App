import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {CarouselSquare} from '@src/shared/ui/CarouselSquare/CarouselSquare';
import {fullWidthPlusPadding, globalPadding} from '@src/app/styles';
import {Category, categoryData} from '@src/entities/Category';
import {ArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';

const CategoriesCarousel = () => {
  return (
    <View style={styles.carousel}>
      <View style={styles.carouseTopBlock}>
        <Text style={styles.carouseTitle}>Categories</Text>
        <View style={styles.seeAllWrapper}>
          <Text style={styles.seeAll}>See all</Text>
          <SvgXml xml={ArrowRightIcon} style={styles.arrowIcon} />
        </View>
      </View>
      <CarouselSquare Component={Category} data={categoryData} />
    </View>
  );
};

export const ComponentWrapper = memo(CategoriesCarousel);

const styles = StyleSheet.create({
  carousel: {
    height: 220,
    width: fullWidthPlusPadding,
  },
  carouseTopBlock: {
    padding: globalPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  carouseTitle: {
    fontSize: 18,
  },
  seeAll: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 5,
  },
  arrowIcon: {
    height: 15,
    width: 15,
  },
  seeAllWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
