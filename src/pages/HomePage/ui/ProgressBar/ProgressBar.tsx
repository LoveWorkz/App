import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {isPlatformIos} from '@src/shared/consts/common';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import {getProgressBarImage} from '../../model/lib/homePage';
import homePageStore from '../../model/store/HomePageStore';

const ProgressBar = () => {
  const {t} = useTranslation();
  const colors = useColors();
  const {theme} = useTheme();
  const {homePageCategoryName, homePageCategoryKey} = homePageStore;

  const progressBarImage = getProgressBarImage({
    category: homePageCategoryKey,
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
        <FastImage
          resizeMode={'contain'}
          source={progressBarImage}
          style={styles.progressImage}
        />
      )}
      {homePageCategoryKey !== 'Starter' && (
        <AppText
          style={[
            styles[homePageCategoryKey],
            {color: colors.homePageCategoryTextColor},
          ]}
          weight={'700'}
          size={TextSize.LEVEL_4}
          text={homePageCategoryName}
        />
      )}
    </View>
  );
};
export default memo(observer(ProgressBar));

const styles = StyleSheet.create<Record<string, any>>({
  ProgressBar: {},
  currentLevelText: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
    marginLeft: horizontalScale(globalPadding),
  },
  progressImage: {
    width: windowWidth,
    height: verticalScale(190),
  },

  Basic: {
    position: 'absolute',
    bottom: 55,
    left: isPlatformIos ? 62 : 65,
    color: '#885FFF',
  },
  Deep: {
    position: 'absolute',
    bottom: 80,
    left: isPlatformIos ? 180 : 192,
    color: '#885FFF',
  },
  Intimate: {
    position: 'absolute',
    bottom: 140,
    left: isPlatformIos ? 178 : 190,
    color: '#885FFF',
  },
  Hot: {
    position: 'absolute',
    bottom: 145,
    left: isPlatformIos ? 298 : 315,
    color: '#885FFF',
  },
});
