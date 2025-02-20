import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText} from '@src/shared/ui/AppText/AppText';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {isPlatformIos} from '@src/shared/consts/common';
import {CategoryKey} from '@src/entities/Category';
import {useTheme} from '@src/app/providers/themeProvider';
import homePageStore from '../../model/store/HomePageStore';
import LevelNameItem from './LevelNameItem';
// import {MiniFlower} from '@src/entities/MiniFlower/MiniFlower';

const progressBarImgTop = horizontalScale(20);

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

  const content = (
    <>
      <FastImage
        resizeMode={'contain'}
        source={progressBarImg}
        style={styles.progressImage}
      />
      {/* <MiniFlower currentLevel={1} /> */}
      <LevelNameItem
        progressBarCategoryKey={progressBarCategoryKey}
        progressBarCategoryName={progressBarCategoryName}
        baseLevelKey={CategoryKey.Starter}
      />
      <LevelNameItem
        progressBarCategoryKey={progressBarCategoryKey}
        progressBarCategoryName={progressBarCategoryName}
        baseLevelKey={CategoryKey.Basic}
      />
      <LevelNameItem
        progressBarCategoryKey={progressBarCategoryKey}
        progressBarCategoryName={progressBarCategoryName}
        baseLevelKey={CategoryKey.Deep}
      />
      <LevelNameItem
        progressBarCategoryKey={progressBarCategoryKey}
        progressBarCategoryName={progressBarCategoryName}
        baseLevelKey={CategoryKey.Intimate}
      />
    </>
  );

  return (
    <View>
      <AppText
        style={[styles.currentLevelText, {color: colors.white}]}
        weight={'600'}
        text={t('home.current_level')}
      />
      {content}
    </View>
  );
};
export default memo(observer(ProgressBar));

const quadrantImageHeight = 90;
const quadrantImageWidth = 90;

const styles = StyleSheet.create({
  currentLevelText: {
    marginTop: verticalScale(isPlatformIos ? 15 : 25),
    marginBottom: verticalScale(20),
    marginLeft: horizontalScale(globalPadding),
  },
  progressImage: {
    width: windowWidth,
    height: horizontalScale(250),
  },
  guidedTourProgressBar: {
    top: isPlatformIos ? 0 : -progressBarImgTop,
  },
  progressImageCopilotStep: {
    height: horizontalScale(isPlatformIos ? 230 : 230),
    top: isPlatformIos ? 0 : progressBarImgTop,
  },
  quadrantCopilotStept: {
    position: 'absolute',
    right: horizontalScale(isPlatformIos ? 10 : 15),
    top: horizontalScale(isPlatformIos ? 150 : 190),
    height: quadrantImageHeight,
    width: quadrantImageWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quadrantImage: {
    width: quadrantImageWidth,
    height: quadrantImageHeight,
    top: horizontalScale(isPlatformIos ? 0 : -30),
  },
});
