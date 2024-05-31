import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import {CarouselSquare} from '@src/shared/ui/CarouselSquare/CarouselSquare';
import {Category, categoryExample, CateorySize} from '@src/entities/Category';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {horizontalScale, moderateScale} from '@src/shared/lib/Metrics';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';

interface CategoriesCarouselProps {
  isLoading: boolean;
}

const CategoriesCarousel = (props: CategoriesCarouselProps) => {
  const {isLoading} = props;
  const homePageLevels = categoriesStore.homePageLevels;

  const formatedCategories = useMemo(() => {
    if (isLoading) {
      return [
        {
          ...categoryExample,
          image: categoryExample.image?.middle,
          isLoading: true,
        },
      ];
    }

    return homePageLevels.map(level => {
      return {
        ...level,
        image: level.image.middle,
        size: CateorySize.L,
        isLoading: false,
        isHomepage: true,
      };
    });
  }, [homePageLevels, isLoading]);

  return (
    <View>
      {isLoading ? (
        <>
          <View style={{top: horizontalScale(10)}}>
            <Skeleton width={200} height={20} />
          </View>
        </>
      ) : (
        <>
          <AppText
            weight={'900'}
            size={TextSize.SIZE_24}
            text={'Want to explore more?'}
          />
          <View style={styles.text}>
            <AppText weight={'500'} text={'Levels & Sessions'} />
          </View>
        </>
      )}
      {!!formatedCategories.length && (
        <CarouselSquare
          Component={Category}
          // when loading, adding example data to make skeleton work
          data={formatedCategories}
          itemStyle={styles.itemStyle}
          carouselHeight={220}
        />
      )}
    </View>
  );
};

export default memo(observer(CategoriesCarousel));

const styles = StyleSheet.create({
  itemStyle: {
    borderRadius: moderateScale(20),
  },
  text: {
    top: horizontalScale(20),
  },
  seeAll: {
    textDecorationLine: 'underline',
  },
  arrowIcon: {
    marginLeft: horizontalScale(5),
    height: horizontalScale(15),
    width: horizontalScale(15),
  },
  seeAllWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
