import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {SvgXml} from 'react-native-svg';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {profileStore} from '@src/entities/Profile';
import {CategoryName} from '@src/entities/Category';
import {isPlatformIos} from '@src/shared/consts/common';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import {getProgressBarIcon} from '../../model/lib/homePage';

const ProgressBar = () => {
  const {t} = useTranslation();
  const colors = useColors();
  const {theme} = useTheme();

  const firstCategory: CategoryName = 'Starter';
  let currentCategoryName: CategoryName = firstCategory;
  const currentCategory = profileStore.currentCategory;

  if (currentCategory) {
    currentCategoryName = currentCategory.currentCategory as CategoryName;
  }

  const progressBarImage = getProgressBarIcon({
    category: currentCategoryName,
    isDarkMode: theme === Theme.Dark,
  });

  return (
    <View>
      <AppText
        style={[styles.currentLevelText, {color: colors.primaryTextColor}]}
        weight={'500'}
        size={TextSize.LEVEL_4}
        text={t('home.current_level')}
      />

      {progressBarImage && (
        <SvgXml xml={progressBarImage} style={styles.icon} />
      )}
      {currentCategoryName !== 'Starter' && (
        <AppText
          style={[
            styles[currentCategoryName],
            {color: colors.homePageCategoryTextColor},
          ]}
          weight={'700'}
          size={TextSize.LEVEL_4}
          text={t(`categories.${currentCategoryName}`)}
        />
      )}
    </View>
  );
};
export default memo(observer(ProgressBar));

const styles = StyleSheet.create<Record<string, any>>({
  ProgressBar: {},
  currentLevelText: {
    marginTop: verticalScale(25),
    marginBottom: verticalScale(20),
    marginLeft: horizontalScale(globalPadding),
  },
  icon: {
    width: windowWidth,
    height: 166,
  },

  Basic: {
    position: 'absolute',
    bottom: 45,
    left: isPlatformIos ? 60 : 75,
    color: '#885FFF',
  },
  Deep: {
    position: 'absolute',
    bottom: 72,
    left: isPlatformIos ? 175 : 192,
    color: '#885FFF',
  },
  Intimate: {
    position: 'absolute',
    bottom: 125,
    left: isPlatformIos ? 178 : 190,
    color: '#885FFF',
  },
  Hot: {
    position: 'absolute',
    bottom: 135,
    left: isPlatformIos ? 285 : 310,
    color: '#885FFF',
  },
});
