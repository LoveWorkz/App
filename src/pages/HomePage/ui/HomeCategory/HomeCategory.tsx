import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import {observer} from 'mobx-react-lite';

import {getArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {
  globalStyles,
  windowWidthMinusPaddings,
} from '@src/app/styles/GlobalStyle';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {
  homeCategoryImage,
  homeCategoryImageDark,
} from '@src/shared/assets/images';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import HomePageStore from '../../model/store/HomePageStore';

const HomeCategory = () => {
  const {t} = useTranslation();
  const colors = useColors();
  const {theme} = useTheme();

  return (
    <View style={{width: windowWidthMinusPaddings}}>
      <AppText
        style={[styles.quickStart, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={t('home.quick_start')}
        weight={'500'}
      />
      <View style={{...globalStyles.shadowOpacity}}>
        <FastImage
          style={[
            styles.container,
            {
              backgroundColor: colors.bgTertiaryColor,
            },
          ]}
          source={
            theme === Theme.Dark ? homeCategoryImageDark : homeCategoryImage
          }>
          <View style={styles.content}>
            <View style={styles.textWrapper}>
              <AppText
                style={{color: colors.homePageCategoryTitleColor}}
                size={TextSize.LEVEL_2}
                text={t('home.continue_where_you_left_off')}
              />
              <GradientText weight={'700'} text={'0/40'} />
            </View>
            <View style={styles.bottomBlock}>
              <AppText
                style={{color: colors.primaryTextColor}}
                weight={'700'}
                size={TextSize.LEVEL_5}
                text={HomePageStore.homePageCategoryName}
              />
              <Button style={styles.btn} theme={ButtonTheme.GRADIENT}>
                <SvgXml
                  xml={getArrowRightIcon({})}
                  style={styles.arrowIcon}
                  fill={colors.bgQuinaryColor}
                />
              </Button>
            </View>
          </View>
        </FastImage>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 92,
    borderRadius: 20,
    justifyContent: 'center',
  },
  content: {
    padding: 15,
  },
  quickStart: {
    marginBottom: verticalScale(20),
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomBlock: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  status: {
    fontSize: 18,
    fontWeight: '700',
  },
  btn: {
    borderRadius: 10,
    height: verticalScale(30),
    width: horizontalScale(30),
  },
  arrowIcon: {
    height: 15,
    width: 15,
  },
});

export const ComponentWrapper = memo(observer(HomeCategory));
