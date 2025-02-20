import React, {memo} from 'react';
import {StyleSheet} from 'react-native';

import {categoryStore, CategoryType} from '@src/entities/Category';
import {CarouselSquare} from '@src/shared/ui/CarouselSquare/CarouselSquare';
import {verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import {isPlatformIos} from '@src/shared/consts/common';
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

  const defaultElement = categoryStore.getLevelNumberById(
    levels,
    currentLevel.id,
  );

  const levelsWithMetaDatas = levels.map(level => {
    // return {...level, sessionsCount: level.allSessionsCount, isFavorite};
    return {...level, sessionsCount: 8, isFavorite};
  });

  return (
    <CarouselSquare
      defaultElement={defaultElement}
      onSwipeHandler={swipeHandler}
      Component={Carouseltem}
      data={levelsWithMetaDatas}
      carouselHeight={verticalScale(318)}
      mode={'expanded'}
      loop={false}
      paginationStyle={styles.paginationStyle}
      withBottomNavigation
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
