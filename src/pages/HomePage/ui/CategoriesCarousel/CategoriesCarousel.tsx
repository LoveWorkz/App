import React, {memo} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {CarouselSquare} from '@src/shared/ui/CarouselSquare/CarouselSquare';
import {globalPadding} from '@src/app/styles/GlobalStyle';
import {Category, categoryData} from '@src/entities/Category';
import {ArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';

const CategoriesCarousel = () => {
  const {t} = useTranslation();

  const onPressHandler = () => {
    navigation.navigate(TabRoutesNames.CATEGORIES);
  };

  return (
    <View style={styles.carousel}>
      <View style={styles.carouseTopBlock}>
        <AppText
          weight={'500'}
          size={TextSize.LEVEL_5}
          text={t('home.categories')}
        />
        <Pressable onPress={onPressHandler}>
          <View style={styles.seeAllWrapper}>
            <AppText
              style={styles.seeAll}
              weight={'700'}
              size={TextSize.LEVEL_4}
              text={t('home.see_all')}
            />
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
  },
  carouseTopBlock: {
    padding: globalPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  seeAll: {
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
