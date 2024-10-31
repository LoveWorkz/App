import React, {memo} from 'react';
import FastImage from 'react-native-fast-image';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {onboardingBgWithLine, onboardingBgWithLineDark, statisticImage2} from '@src/shared/assets/images';
import {verticalScale} from '@src/shared/lib/Metrics';
import {TextSize} from '@src/shared/ui/AppText/AppText';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import OnboardingContainer from '../../../OnboardingContainer/OnboardingContainer';
import {Theme, useTheme} from '@src/app/providers/themeProvider';

const Screen2 = () => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const isDark = theme === Theme.Dark;

  const image = (
    <FastImage
      resizeMode="contain"
      source={statisticImage2}
      style={styles.img}
    />
  );

  return (
    <OnboardingContainer bgImage={isDark ? onboardingBgWithLineDark : onboardingBgWithLine} imageChildren={image}>
      <View style={styles.contentWrapper}>
        <GradientText
          size={TextSize.LEVEL_7}
          weight={'700'}
          text={t('onboarding.statistic.screen_2_description')}
          align="center"
        />
      </View>
    </OnboardingContainer>
  );
};

export default memo(Screen2);

const styles = StyleSheet.create({
  img: {
    height: verticalScale(450),
    width: '100%',
    top: verticalScale(-15),
  },
  contentWrapper: {
    width: '80%',
    alignItems: 'center',
    top: verticalScale(-20),
  },
});
