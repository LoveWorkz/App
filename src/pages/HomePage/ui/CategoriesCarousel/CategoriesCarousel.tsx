import React, {memo} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {CarouselSquare} from '@src/shared/ui/CarouselSquare/CarouselSquare';
import {Category, categoryData} from '@src/entities/Category';
import {getArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {TabRoutesNames} from '@src/shared/config/route/tabConfigRoutes';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {useColors} from '@src/app/providers/colorsProvider';
import {globalPadding} from '@src/app/styles/GlobalStyle';

const CategoriesCarousel = () => {
  const {t} = useTranslation();
  const colors = useColors();

  const onPressHandler = () => {
    navigation.navigate(TabRoutesNames.CATEGORIES);
  };

  return (
    <View style={styles.carousel}>
      <View
        style={[styles.carouseTopBlock, {paddingHorizontal: globalPadding}]}>
        <AppText
          style={{color: colors.primaryTextColor}}
          weight={'500'}
          size={TextSize.LEVEL_5}
          text={t('home.categories')}
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
      <CarouselSquare
        isLandscape
        Component={Category}
        // itemStyle={styles.itemStyle}
        data={categoryData}
      />
    </View>
  );
};

export const ComponentWrapper = memo(CategoriesCarousel);

const styles = StyleSheet.create({
  carousel: {
    height: 200,
  },
  itemStyle: {
    borderRadius: 20,
  },
  carouseTopBlock: {
    marginBottom: -10,
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
