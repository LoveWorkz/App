import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';

import {windowWidth} from '@src/app/styles/GlobalStyle';
import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {GradientArrowButton} from '@src/shared/ui/GradientArrowButton/GradientArrowButton';
import {Button} from '@src/shared/ui/Button/Button';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {onboardingBg} from '@src/shared/assets/images';
import {notificationsImage} from '@src/shared/assets/images';
import {isPlatformIos} from '@src/shared/consts/common';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {onboardingStyles} from '../../styles';
import OnboardingContainer from '../../OnboardingContainer/OnboardingContainer';
import onboardingStore from '../../model/onboardingStore';

const OnboardingNotificationsPage = () => {
  const {t} = useTranslation();

  const onAllowNotificationsPressHandler = useCallback(() => {
    onboardingStore.allowNotificationsAndNavigate();
  }, []);

  const onPerhapsLaterPressHandler = () => {
    navigation.navigate(AppRouteNames.ONBOARDING_STATISTIC);
  };

  const image = (
    <FastImage
      resizeMode="contain"
      source={notificationsImage}
      style={styles.img}
    />
  );

  return (
    <View style={styles.OnboardingNotificationsPage}>
      <OnboardingContainer
        bgImage={onboardingBg}
        imageChildren={image}
        isNotification>
        <View style={styles.contentWrapper}>
          <AppText
            style={styles.description1}
            size={TextSize.LEVEL_5}
            weight={'500'}
            text={t('onboarding.notification.description')}
            align="center"
          />
          <GradientText
            size={TextSize.LEVEL_7}
            weight={'700'}
            text={t('onboarding.notification.description2')}
            align="center"
          />
          <AppText
            style={styles.description3}
            size={TextSize.LEVEL_5}
            weight={'700'}
            text={t('onboarding.notification.description3')}
            align="center"
          />
        </View>
      </OnboardingContainer>

      <View style={styles.bottomSide}>
        <Button
          onPress={onPerhapsLaterPressHandler}
          style={styles.perhapsLaterBtn}>
          <AppText
            style={styles.perhapsLaterText}
            size={TextSize.LEVEL_4}
            weight={'600'}
            text={t('onboarding.notification.perhaps_later')}
            lineHeight={31}
            align="center"
          />
        </Button>
        <View style={styles.btnWrapper}>
          <GradientArrowButton
            text={t('onboarding.notification.allow_notifications')}
            onPressHandler={onAllowNotificationsPressHandler}
          />
        </View>
      </View>
    </View>
  );
};

export default memo(OnboardingNotificationsPage);

const styles = StyleSheet.create({
  OnboardingNotificationsPage: {
    flex: 1,
    top: verticalScale(isPlatformIos ? 0 : -20),
  },
  img: {
    height: verticalScale(500),
    width: windowWidth,
    top: verticalScale(-50),
  },
  contentWrapper: {
    width: '80%',
    alignItems: 'center',
    top: verticalScale(-80),
  },
  description1: {
    marginBottom: verticalScale(20),
  },
  description3: {
    marginTop: verticalScale(20),
  },
  perhapsLaterBtn: {
    marginBottom: verticalScale(8),
  },
  perhapsLaterText: {
    textDecorationLine: 'underline',
  },
  bottomSide: {
    ...onboardingStyles.bottomSide,
    width: '100%',
    bottom: verticalScale(isPlatformIos ? 15 : -15),
  },
  btnWrapper: {
    ...onboardingStyles.btnWrapper,
  },
});
