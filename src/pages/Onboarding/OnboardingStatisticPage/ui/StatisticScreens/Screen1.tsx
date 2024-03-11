import React, {memo} from 'react';
import FastImage from 'react-native-fast-image';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {onboardingBgWithLine, statisticImage1} from '@src/shared/assets/images';
import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import OnboardingContainer from '../../../OnboardingContainer/OnboardingContainer';

const Screen1 = () => {
  const {t} = useTranslation();

  const image = (
    <FastImage
      resizeMode="contain"
      source={statisticImage1}
      style={styles.img}
    />
  );

  return (
    <OnboardingContainer bgImage={onboardingBgWithLine} imageChildren={image}>
      <View style={styles.contentWrapper}>
        <AppText
          style={styles.title}
          size={TextSize.LEVEL_5}
          weight={'500'}
          align="center"
          text={t('onboarding.statistic.playful_effective')}
        />

        <GradientText
          size={TextSize.LEVEL_7}
          weight={'700'}
          text={t('onboarding.statistic.screen_1_description')}
          align="center"
        />
      </View>
    </OnboardingContainer>
  );
};

export default memo(Screen1);

const styles = StyleSheet.create({
  img: {
    height: verticalScale(450),
    width: '80%',
    top: verticalScale(-20),
  },
  contentWrapper: {
    width: '80%',
    alignItems: 'center',
    top: verticalScale(-60),
  },
  title: {
    marginBottom: verticalScale(20),
  },
});
