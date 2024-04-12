import React, {memo, useCallback} from 'react';
import {StyleSheet} from 'react-native';

import {categoryStore, CategoryType} from '@src/entities/Category';
import {CarouselSquare} from '@src/shared/ui/CarouselSquare/CarouselSquare';
import {verticalScale} from '@src/shared/lib/Metrics';
import {useColors} from '@src/app/providers/colorsProvider';
import {sessionStore} from '@src/entities/Session';
import Carouseltem from './Carouseltem';

interface HeaderSectionProps {
  levels: CategoryType[];
  currentLevel: CategoryType;
}

const HeaderSection = (props: HeaderSectionProps) => {
  const {levels, currentLevel} = props;
  const colors = useColors();

  const sessionsCount = sessionStore.getAllSessionsCount();

  const defaultElement = categoryStore.getLevelNumberById(
    levels,
    currentLevel.id,
  );

  const onCategoryChangeHandler = useCallback((level: CategoryType) => {
    sessionStore.levelSwipeHandler(level.id);
  }, []);

  const test = levels.map(level => {
    return {...level, sessionsCount};
  });

  return (
    <CarouselSquare
      defaultElement={defaultElement}
      onSwipeHandler={onCategoryChangeHandler}
      Component={Carouseltem}
      data={test}
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
