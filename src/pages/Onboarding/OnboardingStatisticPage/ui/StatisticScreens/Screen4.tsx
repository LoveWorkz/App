import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';

import {onboardingBg, statisticImage3} from '@src/shared/assets/images';
import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {useColors} from '@src/app/providers/colorsProvider';
import {GradientArrowButton} from '@src/shared/ui/GradientArrowButton/GradientArrowButton';
import { setOnboardingStatusAndNavigate } from '@src/pages/Onboarding/lib/onboardingLib';
import { isPlatformIos } from '@src/shared/consts/common';
import {onboardingStyles, onboardingWidth} from '../../../styles';
import OnboardingContainer from '../../../OnboardingContainer/OnboardingContainer';

const Screen4 = () => {
  const {t} = useTranslation();
  const colors = useColors();

  const onLetsStartPressHandler = useCallback(() => {
    setOnboardingStatusAndNavigate();
  }, []);

  const image = (
    <View style={styles.topPart}>
      <FastImage
        resizeMode="contain"
        source={statisticImage3}
        style={styles.img}
      />
      <AppText
        style={[styles.title, {color: colors.white}]}
        size={TextSize.LEVEL_6}
        weight={'700'}
        text={t('onboarding.statistic.screen_4_description')}
        align="center"
      />
    </View>
  );

  return (
    <View>
      <OnboardingContainer bgImage={onboardingBg} imageChildren={image}>
        <View style={styles.contentWrapper}>
          <GradientText
            size={TextSize.LEVEL_7}
            weight={'700'}
            text={'9/10'}
            align="center"
          />
          <GradientText
            size={TextSize.LEVEL_7}
            weight={'700'}
            text={t('onboarding.statistic.screen_4_description2')}
            align="center"
          />
        </View>
      </OnboardingContainer>
      <View style={styles.bottomSide}>
        <View style={styles.btnWrapper}>
          <GradientArrowButton
            activeOpacity={0.9}
            text={t('lets_start')}
            onPressHandler={onLetsStartPressHandler}
          />
        </View>
      </View>
    </View>
  );
};

export default memo(Screen4);

const bottom = verticalScale(isPlatformIos ? -100 : -115);

const styles = StyleSheet.create({
  topPart: {
    top: verticalScale(20), 
    width: '100%',
    alignItems: 'center',
    height: verticalScale(350),
  },
  img: {
    height: verticalScale(350),
    width: '70%',
  },
  title: {
    top: verticalScale(-70),
    width: '80%',
  },
  contentWrapper: {
    width: '80%',
    alignItems: 'center',
    top: verticalScale(-50),
  },
  bottomSide: {
    ...onboardingStyles.bottomSide,
    bottom,
  },
  btnWrapper: {
    width: onboardingWidth,
  },
});
