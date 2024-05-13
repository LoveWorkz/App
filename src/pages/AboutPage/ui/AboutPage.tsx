import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {verticalScale} from '@src/shared/lib/Metrics';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {AppIconImg, gradientBg} from '@src/shared/assets/images';
import {TextSection} from '@src/shared/ui/TextSection/TextSection';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {TextSize} from '@src/shared/ui/AppText/AppText';
import ScrollViewWithoutIndicator from '@src/shared/ui/ScrollViewWithoutIndicator/ScrollViewWithoutIndicator';
import {HEADER_HEIGHT, isPlatformIos} from '@src/shared/consts/common';
import {CustomHeader} from '@src/widgets/headers/CustomHeader';
import {descriptions1, descriptions2, descriptions3} from '../lib/howToUse';

const AboutPage = () => {
  return (
    <View style={styles.about}>
      <CustomHeader
        title={'About the app'}
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
              <TextSection title="Congrats" paragraph={descriptions1} />
            </View>

            <View style={styles.item}>
              <GradientText
                lineHeight={25}
                size={TextSize.SIZE_24}
                align="center"
                weight="700"
                text={
                  'But the truth is, love is not enough to keep the bond strong and healthy'
                }
              />
            </View>

            <View style={styles.item}>
              <TextSection paragraph={descriptions2} />
            </View>
            <TextSection title="We have your back." paragraph={descriptions3} />
          </View>
        </View>
      </ScrollViewWithoutIndicator>
    </View>
  );
};

export default memo(AboutPage);

const imageHeight = 500;

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
    top: isPlatformIos ? -210 : -250,
    padding: globalPadding,
  },
  item: {
    marginBottom: verticalScale(25),
  },
});
