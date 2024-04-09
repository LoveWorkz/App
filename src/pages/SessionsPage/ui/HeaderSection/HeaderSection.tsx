import React, {memo} from 'react';
import {StyleSheet} from 'react-native';

import {CategoryType} from '@src/entities/Category';
import {CarouselSquare} from '@src/shared/ui/CarouselSquare/CarouselSquare';
import {verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import Carouseltem from './Carouseltem';

interface HeaderSectionProps {
  categories: CategoryType[];
}

const HeaderSection = (props: HeaderSectionProps) => {
  const {categories} = props;
  const colors = useColors();

  return (
    <CarouselSquare
      Component={Carouseltem}
      data={categories}
      carouselHeight={verticalScale(300)}
      mode={'expanded'}
      loop={false}
      paginationStyle={styles.paginationStyle}
      withTopPagination
      paginationDotColor={colors.lavenderBlue}
    />
  );
};

export default memo(HeaderSection);

const styles = StyleSheet.create({
  paginationStyle: {
    bottom: verticalScale(-15),
  },
});
