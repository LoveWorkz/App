import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {verticalScale} from '@src/shared/lib/Metrics';
import {HaveAnAccount} from '@src/widgets/HaveAnAccount';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {WelcomPageImage} from '@src/shared/assets/images';
import {GradientArrowButton} from '@src/shared/ui/GradientArrowButton/GradientArrowButton';
import {onboardingStyles, onboardingWidth} from '../../styles';

const WelcomePage = () => {
  const colors = useColors();
  const {t} = useTranslation();

  const onLoginPressHandler = useCallback(() => {
    navigation.navigate(AppRouteNames.AUTH);
  }, []);

  const letsDoThisPressHandler = useCallback(() => {
    navigation.navigate(AppRouteNames.ONBOARDING_GOALS);
  }, []);

  return (
    <View style={styles.WelcomePage}>
      <View style={styles.content}>
        <FastImage
          style={styles.image}
          source={WelcomPageImage}
          resizeMode={'contain'}
        />
        <AppText
          style={[styles.title, {color: colors.primaryTextColor}]}
          size={TextSize.LEVEL_7}
          weight={'700'}
          text={t('welcome.title')}
          lineHeight={31}
        />
        <View style={styles.descriptionWrapper}>
          <AppText
            style={{color: colors.primaryTextColor}}
            size={TextSize.LEVEL_5}
            weight={'500'}
            lineHeight={24}
            align="center"
            text={t('welcome.description')}
          />
        </View>
      </View>
      <View style={styles.bottomSide}>
        <HaveAnAccount
          text={t('auth.already_have_an_account')}
          type={t('auth.login')}
          onPressHandler={onLoginPressHandler}
        />
        <View style={styles.btnWrapper}>
          <GradientArrowButton
            text={t('lets_do_this')}
            onPressHandler={letsDoThisPressHandler}
          />
        </View>
      </View>
    </View>
  );
};

export default memo(WelcomePage);

const styles = StyleSheet.create({
  WelcomePage: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    top: verticalScale(100),
    width: onboardingWidth,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: verticalScale(200),
  },
  title: {
    marginBottom: verticalScale(20),
    marginTop: verticalScale(10),
  },
  descriptionWrapper: {
    width: '85%',
  },
  bottomSide: {
    ...onboardingStyles.bottomSide,
  },
  btnWrapper: {
    ...onboardingStyles.btnWrapper,
    marginTop: verticalScale(10),
  },
});
