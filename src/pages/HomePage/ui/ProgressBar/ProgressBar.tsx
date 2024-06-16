import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';
import {CopilotStep, walkthroughable} from 'react-native-copilot';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText} from '@src/shared/ui/AppText/AppText';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {
  quadrantImage,
  guidedTourProgressBarImage,
} from '@src/shared/assets/images';
import {guidedTourStore} from '@src/widgets/GuidedTour';
import {isPlatformIos} from '@src/shared/consts/common';
import {CategoryKey} from '@src/entities/Category';
import {useTheme} from '@src/app/providers/themeProvider';
import homePageStore from '../../model/store/HomePageStore';
import LevelNameItem from './LevelNameItem';

const WalkthroughableWiew = walkthroughable(View);
const progressBarImgTop = horizontalScale(20);

const ProgressBar = () => {
  const {t} = useTranslation();
  const colors = useColors();
  const {theme} = useTheme();
  const {progressBarCategoryName, progressBarCategoryKey, progressBarImg} =
    homePageStore;
  const isGuidedTourCompleted = guidedTourStore.isGuidedTourCompleted;

  useEffect(() => {
    homePageStore.getProgressBarImage(theme);
  }, [theme]);

  if (!progressBarImg) {
    return <></>;
  }

  const content = isGuidedTourCompleted ? (
    <>
      <FastImage
        resizeMode={'cover'}
        source={progressBarImg}
        style={styles.progressImage}
      />
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
  ) : (
    <>
      <CopilotStep
        name="Your way to more intimac"
        order={1}
        text="This progress bar tracks your journey— think of it as an Intimacy meter. With our coach function at your fingertips, we ensure you engage in the right session at the perfect moment, guiding you through each level.">
        <WalkthroughableWiew style={styles.progressImageCopilotStep}>
          <FastImage
            resizeMode={'cover'}
            source={guidedTourProgressBarImage}
            style={[styles.progressImage, styles.guidedTourProgressBar]}
          />
        </WalkthroughableWiew>
      </CopilotStep>

      <CopilotStep
        name="The flower shows the current focus of the session"
        order={2}
        text="Letting you know which of the four quadrants you're diving into.">
        <WalkthroughableWiew style={styles.quadrantCopilotStept}>
          <FastImage
            resizeMode={'cover'}
            source={quadrantImage}
            style={styles.quadrantImage}
          />
        </WalkthroughableWiew>
      </CopilotStep>
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
