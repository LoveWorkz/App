import React, {memo} from 'react';
import {StyleSheet} from 'react-native';

import {categoryStore, CategoryType} from '@src/entities/Category';
import {CarouselSquare} from '@src/shared/ui/CarouselSquare/CarouselSquare';
import {verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import {isPlatformIos} from '@src/shared/consts/common';
import {sessionStore} from '@src/entities/Session';
import Carouseltem from './Carouseltem';

interface HeaderSectionProps {
  levels: CategoryType[];
  currentLevel: CategoryType;
  isFavorite: boolean;
  swipeHandler: (level: CategoryType) => void;
}

const HeaderSection = (props: HeaderSectionProps) => {
  const {levels, currentLevel, isFavorite, swipeHandler} = props;
  const colors = useColors();

  const sessionsCount = sessionStore.getAllSessionsCount();

  const defaultElement = categoryStore.getLevelNumberById(
    levels,
    currentLevel.id,
  );

  const levelsWithMetaDatas = levels.map(level => {
    return {...level, sessionsCount, isFavorite};
  });

  return (
    <CarouselSquare
      defaultElement={defaultElement}
      onSwipeHandler={swipeHandler}
      Component={Carouseltem}
      data={levelsWithMetaDatas}
      carouselHeight={verticalScale(isPlatformIos ? 300 : 310)}
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
