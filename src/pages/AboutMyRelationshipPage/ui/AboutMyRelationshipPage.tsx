import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useHeaderHeight} from '@react-navigation/elements';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';

import {isPlatformIos} from '@src/shared/consts/common';
import {Theme, useTheme} from '@src/app/providers/themeProvider';
import {
  HomepageBackground,
  HomepageBackgroundDark,
} from '@src/shared/assets/images';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {Avatar} from '@src/shared/ui/Avatar/Avatar';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {Gradient} from '@src/shared/ui/Gradient/Gradient';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {GradientHeartsIcon} from '@src/shared/assets/icons/Hearts';
import RelationshipStatusSelect from './RelationshipStatusSelect/RelationshipStatusSelect';
import DoYouLiveTogetherSelect from './DoYouLiveTogetherSelect/DoYouLiveTogetherSelect';
import DoYouHaveKidsSelect from './DoYouHaveKidsSelect/DoYouHaveKidsSelect';

const AboutMyRelationshipPage = () => {
  const {theme} = useTheme();
  const colors = useColors();
  const {t} = useTranslation();

  const navbarHeaderHeight = useHeaderHeight();
  const statusBarHeight = getStatusBarHeight();
  return (
    <View style={styles.AboutMyRelationshipPage}>
      <FastImage
        style={[
          styles.relationshipPageBackground,
          {
            marginTop: isPlatformIos
              ? -navbarHeaderHeight
              : -navbarHeaderHeight - statusBarHeight,
            paddingTop: isPlatformIos
              ? navbarHeaderHeight
              : navbarHeaderHeight + statusBarHeight,
          },
        ]}
        source={
          theme === Theme.Dark ? HomepageBackgroundDark : HomepageBackground
        }>
        <View style={styles.avatars}>
          <View style={styles.firstImage}>
            <Avatar imageUrl={''} size={170} borderRadius={100} />
            <Gradient style={styles.nameWrapper}>
              <AppText
                style={{color: colors.white}}
                weight={'700'}
                size={TextSize.LEVEL_5}
                text={'John'}
              />
            </Gradient>
            <SvgXml xml={GradientHeartsIcon} style={styles.icon} />
          </View>
          <View style={styles.secondImage}>
            <Avatar imageUrl={''} size={130} borderRadius={100} />
            <Gradient style={[styles.nameWrapper, styles.secondNameWrapper]}>
              <AppText
                style={{color: colors.white}}
                weight={'700'}
                size={TextSize.LEVEL_5}
                text={t('you')}
              />
            </Gradient>
          </View>
        </View>
        <View />
      </FastImage>

      <View style={styles.selectItem}>
        <RelationshipStatusSelect />
      </View>
      <View style={styles.selectItem}>
        <DoYouLiveTogetherSelect />
      </View>
      <View style={styles.selectItem}>
        <DoYouHaveKidsSelect />
      </View>
    </View>
  );
};

export default memo(AboutMyRelationshipPage);

const horizontalPadding = horizontalScale(30);

const styles = StyleSheet.create({
  AboutMyRelationshipPage: {
    flex: 1,
  },
  relationshipPageBackground: {
    marginLeft: -globalPadding,
    width: windowWidth,
    height: 365,
    marginBottom: verticalScale(10),
  },
  avatars: {
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(40),
    top: 20,
  },
  firstImage: {
    position: 'absolute',
    left: horizontalPadding,
    alignItems: 'center',
  },
  secondImage: {
    position: 'absolute',
    right: horizontalPadding,
    alignItems: 'center',
  },
  nameWrapper: {
    top: -20,
    width: '70%',
    alignItems: 'center',
    paddingVertical: verticalScale(4),
  },
  secondNameWrapper: {
    width: '85%',
  },
  icon: {
    position: 'absolute',
    right: -12,
    top: '35%',
  },
  selectItem: {
    marginBottom: verticalScale(20),
  },
});
