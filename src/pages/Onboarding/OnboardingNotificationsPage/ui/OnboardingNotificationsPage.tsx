import React, {memo, useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';

import {windowWidth, globalPadding} from '@src/app/styles/GlobalStyle';
import {notificationsImage, onboardingBg} from '@src/shared/assets/images';
import {verticalScale} from '@src/shared/lib/Metrics';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {GradientArrowButton} from '@src/shared/ui/GradientArrowButton/GradientArrowButton';
import {Button} from '@src/shared/ui/Button/Button';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {useColors} from '@src/app/providers/colorsProvider';
import {onboardingStyles} from '../../styles';

const OnboardingNotificationsPage = () => {
  const {t} = useTranslation();
  const colors = useColors();

  const onAllowNotificationsPressHandler = useCallback(() => {
    navigation.navigate(AppRouteNames.NOTIFICATIONS);
  }, []);

  const onPerhapsLaterPressHandler = () => {
    navigation.navigate(AppRouteNames.TAB_ROUTE);
  };

  return (
    <View style={styles.OnboardingNotificationsPage}>
      <View
        style={[styles.imgWrapper, {backgroundColor: colors.bgnboardingColor}]}>
        <FastImage
          resizeMode="cover"
          source={onboardingBg}
          style={styles.bgImg}>
          <FastImage
            resizeMode="contain"
            source={notificationsImage}
            style={styles.img}
          />
        </FastImage>

        <View style={styles.contentWrapper}>
          <AppText
            style={styles.description1}
            size={TextSize.LEVEL_5}
            weight={'500'}
            text={t('onboarding.notification.description')}
            lineHeight={31}
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
            lineHeight={31}
            align="center"
          />
        </View>
      </View>

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
  },
  imgWrapper: {
    height: verticalScale(690),
    width: windowWidth,
    left: -globalPadding,
    top: -globalPadding,
    alignItems: 'center',
  },
  bgImg: {
    width: '100%',
    height: verticalScale(520),
    alignItems: 'center',
  },
  img: {
    height: verticalScale(450),
    width: windowWidth,
    top: verticalScale(-10),
  },
  contentWrapper: {
    width: '80%',
    alignItems: 'center',
    top: verticalScale(-70),
  },
  description1: {
    marginBottom: verticalScale(15),
  },
  description3: {
    marginTop: verticalScale(15),
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
  },
  btnWrapper: {
    ...onboardingStyles.btnWrapper,
  },
});
