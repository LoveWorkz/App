import {observer} from 'mobx-react-lite';
import React, {useEffect, memo} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import Lottie from 'lottie-react-native';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';

import {splashScreenImage} from '@src/shared/assets/images';
import {globalPadding, windowHeight} from '@src/app/styles/GlobalStyle';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {userStore} from '@src/entities/User';
import {isPlatformIos, SPLASH_PAGE_DURATION} from '@src/shared/consts/common';
import myAnimation from '@src/shared/assets/images/splashScreenLoader.json';

export const colorizeLoader = () => {
  const layersIndexes = [0, 1, 2, 3, 4];
  layersIndexes.forEach(item => {
    const silverColor = [0.6, 0.6, 0.6, 1];
    // @ts-ignore
    myAnimation.layers[item].shapes[0].it[1].c.k = silverColor;
  });
};

colorizeLoader();

export const SplashPage = () => {
  const {t} = useTranslation();

  useEffect(() => {
    const timerId = setTimeout(() => {
      userStore.initAuthUser();
    }, SPLASH_PAGE_DURATION);
    return () => clearTimeout(timerId);
  }, []);

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={'transparent'}
        translucent={true}
        barStyle={'default'}
      />
      <View style={styles.SplashPage}>
        <FastImage
          style={[styles.splashScreenImage]}
          source={splashScreenImage}
          resizeMode={isPlatformIos ? 'contain' : 'cover'}
          // if image loaded hide native splash screen and show dynamic splash screen
        >
          <View style={styles.content}>
            <View style={styles.titleWrapper}>
              <AppText
                style={styles.title}
                weight={'700'}
                size={TextSize.LEVEL_7}
                text={t('splash.title')}
              />
            </View>

            <Lottie style={styles.loader} source={myAnimation} autoPlay loop />
          </View>
        </FastImage>
      </View>
    </>
  );
};

export default memo(observer(SplashPage));

const styles = StyleSheet.create({
  SplashPage: {
    flex: 1,
  },
  splashScreenImage: {
    height: windowHeight + globalPadding,
    margin: -globalPadding,
    resizeMode: 'contain',
    alignItems: 'center',
    flex: 1,
  },
  content: {
    marginTop: verticalScale(180),
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: '#395180',
  },
  titleWrapper: {
    width: '90%',
  },
  loader: {
    width: horizontalScale(140),
    height: verticalScale(140),
    marginLeft: horizontalScale(3),
    marginTop: verticalScale(6),
  },
});
