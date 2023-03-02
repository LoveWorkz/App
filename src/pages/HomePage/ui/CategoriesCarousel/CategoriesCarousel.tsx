import React, {memo} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {CarouselSquare} from '@src/shared/ui/CarouselSquare/CarouselSquare';
import {fullWidthPlusPadding, globalPadding} from '@src/app/styles';
import {Category, categoryData} from '@src/entities/Category';
import {ArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';

const CategoriesCarousel = () => {
  const {t} = useTranslation();

  const onPressHandler = () => {
    navigation.navigate(TabRoutesNames.CATEGORIES);
  };

  return (
    <View style={styles.carousel}>
      <View style={styles.carouseTopBlock}>
        <Text style={styles.carouseTitle}>{t('home.categories')}</Text>
        <Pressable onPress={onPressHandler}>
          <View style={styles.seeAllWrapper}>
            <Text style={styles.seeAll}>{t('home.see_all')}</Text>
            <SvgXml xml={ArrowRightIcon} style={styles.arrowIcon} />
          </View>
        </Pressable>
      </View>
      <CarouselSquare Component={Category} data={categoryData} />
    </View>
  );
};

export const ComponentWrapper = memo(CategoriesCarousel);

const styles = StyleSheet.create({
  carousel: {
    height: 280,
    width: fullWidthPlusPadding,
  },
  carouseTopBlock: {
    padding: globalPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
