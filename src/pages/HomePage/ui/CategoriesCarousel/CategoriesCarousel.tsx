import React, {memo, useMemo} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {CarouselSquare} from '@src/shared/ui/CarouselSquare/CarouselSquare';
import {Category, categoryExample, CateorySize} from '@src/entities/Category';
import {getArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {useColors} from '@src/app/providers/colorsProvider';
import {categoriesStore} from '@src/pages/CategoriesPage';
import {moderateScale} from '@src/shared/lib/Metrics';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';

interface CategoriesCarouselProps {
  isLoading: boolean;
}

const CategoriesCarousel = (props: CategoriesCarouselProps) => {
  const {isLoading} = props;
  const {t} = useTranslation();
  const colors = useColors();
  const categories = categoriesStore.categories;

  const onPressHandler = () => {
    navigation.navigate(TabRoutesNames.CATEGORIES);
  };

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

    return categories.map(category => {
      return {
        ...category,
        image: category.image.middle,
        size: CateorySize.L,
        isLoading: false,
      };
    });
  }, [categories, isLoading]);

  return (
    <View>
      {isLoading ? (
        <View style={[styles.carouseTopBlock]}>
          <Skeleton width={70} height={15} />
          <Skeleton width={70} height={15} />
        </View>
      ) : (
        <View style={[styles.carouseTopBlock]}>
          <AppText
            style={{color: colors.primaryTextColor}}
            weight={'500'}
            size={TextSize.LEVEL_5}
            text={t('categories.categories')}
          />
          <Pressable onPress={onPressHandler}>
            <View style={styles.seeAllWrapper}>
              <GradientText
                style={styles.seeAll}
                weight={'700'}
                size={TextSize.LEVEL_4}
                text={t('home.see_all')}
              />
              <SvgXml
                xml={getArrowRightIcon({isGradient: true})}
                style={styles.arrowIcon}
              />
            </View>
          </Pressable>
        </View>
      )}
      {!!formatedCategories.length && (
        <CarouselSquare
          isLandscape={true}
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

export default memo(CategoriesCarousel);

const styles = StyleSheet.create({
  itemStyle: {
    borderRadius: moderateScale(20),
  },
  carouseTopBlock: {
    marginBottom: -5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seeAll: {
    textDecorationLine: 'underline',
  },
  arrowIcon: {
    marginLeft: 5,
    height: 15,
    width: 15,
  },
  seeAllWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
