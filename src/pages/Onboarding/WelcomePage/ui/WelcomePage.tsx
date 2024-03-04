import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SvgXml} from 'react-native-svg';
import FastImage from 'react-native-fast-image';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {useColors} from '@src/app/providers/colorsProvider';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {HaveAnAccount} from '@src/widgets/HaveAnAccount';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {getArrowRightIcon} from '@src/shared/assets/icons/ArrowRight';
import {WelcomPageImage} from '@src/shared/assets/images';

const WelcomePage = () => {
  const colors = useColors();
  const {t} = useTranslation();

  const onLoginPressHandler = useCallback(() => {
    navigation.navigate(AppRouteNames.AUTH);
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

        <Button style={styles.letsDoThisBtn} theme={ButtonTheme.GRADIENT}>
          <AppText
            style={{color: colors.white}}
            size={TextSize.LEVEL_4}
            weight={'700'}
            text={t('lets_do_this')}
          />
          <SvgXml
            xml={getArrowRightIcon({})}
            fill={colors.white}
            style={styles.icon}
          />
        </Button>
      </View>
    </View>
  );
};

export default memo(WelcomePage);

const width = '90%';

const styles = StyleSheet.create({
  WelcomePage: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    top: verticalScale(100),
    width,
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
    position: 'absolute',
    bottom: verticalScale(20),
    width: '100%',
    alignItems: 'center',
  },
  letsDoThisBtn: {
    marginTop: verticalScale(10),
    width,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: horizontalScale(13),
    height: horizontalScale(13),
    marginLeft: horizontalScale(10),
    top: verticalScale(2),
  },
});
