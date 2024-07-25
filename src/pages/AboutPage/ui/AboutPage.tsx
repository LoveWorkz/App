import React, {memo} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {verticalScale} from '@src/shared/lib/Metrics';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {AppIconImg, gradientBg} from '@src/shared/assets/images';
import {TextSection} from '@src/shared/ui/TextSection/TextSection';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {TextSize} from '@src/shared/ui/AppText/AppText';
import ScrollViewWithoutIndicator from '@src/shared/ui/ScrollViewWithoutIndicator/ScrollViewWithoutIndicator';
import {HEADER_HEIGHT, isPlatformIos} from '@src/shared/consts/common';
import {CustomHeaderWithImage} from '@src/widgets/headers/CustomHeaderWithImage';
import {descriptions1, descriptions2, descriptions3} from '../lib/howToUse';
import {useTranslation} from 'react-i18next';

const AboutPage = () => {
  const {t} = useTranslation();
  return (
    <View style={styles.about}>
      <StatusBar barStyle={'light-content'} />

      <CustomHeaderWithImage
        title={t('common.about_the_app')}
        isWhite
        ImageComponent={
          <FastImage
            style={styles.headerImg}
            resizeMode={'stretch'}
            source={gradientBg}
          />
        }
      />
      <ScrollViewWithoutIndicator>
        <View style={styles.body}>
          <View style={styles.ImageWrapper}>
            <FastImage
              style={styles.image}
              resizeMode={'stretch'}
              source={gradientBg}>
              <FastImage
                style={styles.appImg}
                resizeMode={'contain'}
                source={AppIconImg}
              />
            </FastImage>
          </View>

          <View style={styles.content}>
            <View style={styles.item}>
              <TextSection
                title={t('common.congrats')}
                paragraph={descriptions1}
              />
            </View>

            <View style={styles.item}>
              <GradientText
                lineHeight={25}
                size={TextSize.SIZE_24}
                align="center"
                weight="700"
                text={t('common.but_the_truth_is')}
              />
            </View>

            <View style={styles.item}>
              <TextSection paragraph={descriptions2} />
            </View>
            <TextSection
              title={t('common.we_have_your_back')}
              paragraph={descriptions3}
            />
          </View>
        </View>
      </ScrollViewWithoutIndicator>
    </View>
  );
};

export default memo(AboutPage);

const imageHeight = 500;
const top = isPlatformIos ? -210 : -250;

const styles = StyleSheet.create({
  about: {
    flex: 1,
    width: windowWidth,
  },
  body: {
    top: -HEADER_HEIGHT,
  },
  ImageWrapper: {
    height: imageHeight,
  },
  image: {
    top: HEADER_HEIGHT,
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  appImg: {
    height: 200,
    width: '80%',
  },
  headerImg: {
    height: imageHeight,
    width: '100%',
    paddingHorizontal: globalPadding,
  },
  content: {
    top,
    padding: globalPadding,
    marginBottom: top,
  },
  item: {
    marginBottom: verticalScale(25),
  },
});
