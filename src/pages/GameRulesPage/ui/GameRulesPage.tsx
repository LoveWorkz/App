import React, {memo} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {gameRulesBg} from '@src/shared/assets/images';
import {HEADER_HEIGHT, isPlatformIos} from '@src/shared/consts/common';
import ScrollViewWithoutIndicator from '@src/shared/ui/ScrollViewWithoutIndicator/ScrollViewWithoutIndicator';
import {CustomHeaderWithImage} from '@src/widgets/headers/CustomHeaderWithImage';
import {TextSection} from '@src/shared/ui/TextSection/TextSection';
import {verticalScale} from '@src/shared/lib/Metrics';
import {globalPadding} from '@src/app/styles/GlobalStyle';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  descriptions1,
  descriptions2,
  descriptions3,
  descriptions4,
  descriptions5,
  descriptions6,
  descriptions7,
  title1,
} from '../model/lib/gameRuleslib';
import List from './List';
import {useTranslation} from 'react-i18next';

const GameRulesPage = () => {
  const {t} = useTranslation();
  return (
    <View style={styles.GameRulesPage}>
      <StatusBar barStyle={'light-content'} />

      <CustomHeaderWithImage
        isWhite
        ImageComponent={
          <FastImage
            style={styles.headerImg}
            resizeMode={'cover'}
            source={gameRulesBg}
          />
        }
      />

      <ScrollViewWithoutIndicator>
        <View style={styles.body}>
          <View style={styles.ImageWrapper}>
            <FastImage
              style={styles.image}
              resizeMode={'cover'}
              source={gameRulesBg}
            />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.item}>
            <TextSection title={title1} paragraph={descriptions1} />
          </View>
          <View style={styles.item}>
            <View style={styles.step}>
              <AppText
                lineHeight={25}
                size={TextSize.LEVEL_4}
                weight={'600'}
                text={`${t('common.step')} 1:`}
              />
            </View>
            <TextSection
              title={t('common.create_your_ritual')}
              paragraph={descriptions2}
            />
          </View>
          <View style={styles.item}>
            <View style={styles.step}>
              <AppText
                lineHeight={25}
                size={TextSize.LEVEL_4}
                weight={'600'}
                text={`${t('common.step')} 2:`}
              />
            </View>
            <TextSection
              title={t('common.create_space')}
              paragraph={descriptions3}
            />
          </View>
          <View style={styles.item}>
            <View style={styles.step}>
              <AppText
                lineHeight={25}
                size={TextSize.LEVEL_4}
                weight={'600'}
                text={`${t('common.step')} 3:`}
              />
            </View>

            <TextSection
              title={t('common.dive_into_app_together')}
              paragraph={descriptions4}
            />
          </View>

          <View style={styles.item}>
            <View style={styles.step}>
              <AppText
                lineHeight={25}
                size={TextSize.LEVEL_4}
                weight={'600'}
                text={`${t('common.step')} 4:`}
              />
            </View>

            <View style={styles.title}>
              <AppText
                size={TextSize.SIZE_24}
                weight="700"
                text={t('common.navigate_session_your_way')}
              />
            </View>
            <List />
          </View>
          <View style={styles.item}>
            <View style={styles.step}>
              <AppText
                lineHeight={25}
                size={TextSize.LEVEL_4}
                weight={'600'}
                text={`${t('common.step')} 5:`}
              />
            </View>

            <TextSection
              title={t('common.reflect_together')}
              paragraph={descriptions5}
            />
          </View>
          <View style={styles.item}>
            <TextSection
              title={t('common.how_often_i_play')}
              paragraph={descriptions6}
            />
          </View>
          <View style={styles.item}>
            <TextSection
              title={t('common.important_note')}
              paragraph={descriptions7}
            />
          </View>
        </View>
      </ScrollViewWithoutIndicator>
    </View>
  );
};

export default memo(GameRulesPage);

const imageHeight = 500;
const top = isPlatformIos ? 290 : 250;

const styles = StyleSheet.create({
  GameRulesPage: {
    flex: 1,
  },

  headerImg: {
    height: imageHeight,
    width: '100%',
  },
  ImageWrapper: {
    height: imageHeight,
  },
  image: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },

  body: {
    top: -HEADER_HEIGHT,
  },
  content: {
    top: -top,
    padding: globalPadding,
    marginBottom: -top,
  },
  item: {
    marginBottom: verticalScale(40),
  },
  title: {
    marginBottom: verticalScale(25),
  },
  step: {
    marginBottom: verticalScale(5),
  },
});
