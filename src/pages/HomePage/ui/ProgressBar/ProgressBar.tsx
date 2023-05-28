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
import {CategoryKey} from '@src/entities/Category';
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
          resizeMode={'stretch'}
          source={progressBarImage}
          style={styles.progressImage}
        />
      )}
      {homePageCategoryKey !== CategoryKey.Starter && (
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
    marginTop: verticalScale(isPlatformIos ? 15 : 25),
    marginBottom: verticalScale(20),
    marginLeft: horizontalScale(globalPadding),
  },
  progressImage: {
    width: windowWidth,
    height: 166,
  },

  Basic: {
    position: 'absolute',
    bottom: 45,
    left: isPlatformIos ? 60 : 60,
    color: '#885FFF',
  },
  Deep: {
    position: 'absolute',
    bottom: 70,
    left: isPlatformIos ? 180 : 185,
    color: '#885FFF',
  },
  Intimate: {
    position: 'absolute',
    bottom: 130,
    left: isPlatformIos ? 178 : 180,
    color: '#885FFF',
  },
  Hot: {
    position: 'absolute',
    bottom: 135,
    left: isPlatformIos ? 298 : horizontalScale(305),
    color: '#885FFF',
  },
});
