import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {onboardingBgWithLine} from '@src/shared/assets/images';
import {verticalScale} from '@src/shared/lib/Metrics';
import {TextSize} from '@src/shared/ui/AppText/AppText';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {useColors} from '@src/app/providers/colorsProvider';
import {CarouselSquare} from '@src/shared/ui/CarouselSquare/CarouselSquare';
import OnboardingContainer from '../../../OnboardingContainer/OnboardingContainer';
import CarouselItem from '../CarouselItem/CarouselItem';
import {comments} from '../../model/lib/onboardingStatisticLib';

const Screen3 = () => {
  const {t} = useTranslation();
  const colors = useColors();

  const imageChildren = (
    <View style={styles.carouselWrapper}>
      <CarouselSquare
        withPagination
        isLandscape={true}
        Component={CarouselItem}
        data={comments}
        carouselHeight={230}
        loop={false}
        paginationStyle={styles.paginationStyle}
        paginationDotColor={colors.white}
      />
    </View>
  );

  return (
    <OnboardingContainer
      bgImage={onboardingBgWithLine}
      imageChildren={imageChildren}>
      <View style={styles.contentWrapper}>
        <GradientText
          size={TextSize.LEVEL_7}
          weight={'700'}
          text={t('onboarding.statistic.screen_3_description')}
          align="center"
        />
      </View>
    </OnboardingContainer>
  );
};

export default memo(Screen3);

const styles = StyleSheet.create({
  contentWrapper: {
    width: '80%',
    alignItems: 'center',
    top: verticalScale(-20),
  },
  carouselWrapper: {
    top: verticalScale(110),
  },
  paginationStyle: {
    top: verticalScale(25),
    width: '100%',
    justifyContent: 'center',
  },
});
