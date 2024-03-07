import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {onboardingBgWithLine} from '@src/shared/assets/images';
import {verticalScale} from '@src/shared/lib/Metrics';
import {TextSize} from '@src/shared/ui/AppText/AppText';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import OnboardingContainer from '../../OnboardingContainer/OnboardingContainer';

const Screen3 = () => {
  const {t} = useTranslation();

  return (
    <OnboardingContainer bgImage={onboardingBgWithLine}>
      <View style={styles.contentWrapper}>
        <GradientText
          size={TextSize.LEVEL_7}
          weight={'700'}
          text={t('onboarding.statistic.screen_3_description')}
          lineHeight={35}
          align="center"
        />
      </View>
    </OnboardingContainer>
  );
};

export default memo(Screen3);

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
