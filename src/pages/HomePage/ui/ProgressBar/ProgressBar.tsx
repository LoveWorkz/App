import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {isPlatformIos} from '@src/shared/consts/common';
import {useTheme} from '@src/app/providers/themeProvider';
import homePageStore from '../../model/store/HomePageStore';

const ProgressBar = () => {
  const {t} = useTranslation();
  const colors = useColors();
  const {theme} = useTheme();
  const {progressBarCategoryName, progressBarCategoryKey, progressBarImg} =
    homePageStore;

  useEffect(() => {
    homePageStore.getProgressBarImage(theme);
  }, [theme]);

  if (!progressBarImg) {
    return <></>;
  }

  return (
    <View>
      <AppText
        style={[styles.currentLevelText, {color: colors.primaryTextColor}]}
        weight={'500'}
        size={TextSize.LEVEL_4}
        text={t('home.current_level')}
      />

      <FastImage
        resizeMode={'stretch'}
        source={progressBarImg}
        style={styles.progressImage}
      />

      <AppText
        style={[
          styles[progressBarCategoryKey],
          {color: colors.homePageCategoryTextColor},
        ]}
        weight={'700'}
        size={TextSize.LEVEL_4}
        text={progressBarCategoryName}
      />
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

  Starter: {
    position: 'absolute',
    bottom: 40,
    left: horizontalScale(62),
    color: '#885FFF',
  },
  Basic: {
    position: 'absolute',
    bottom: 65,
    left: horizontalScale(205),
    color: '#885FFF',
  },
  Deep: {
    position: 'absolute',
    bottom: 105,
    left: horizontalScale(160),
    color: '#885FFF',
  },
  Intimate: {
    position: 'absolute',
    bottom: 126,
    left: horizontalScale(295),
    color: '#885FFF',
  },
});
