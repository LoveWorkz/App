import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import {TextSize} from '@src/shared/ui/AppText/AppText';
import {verticalScale} from '@src/shared/lib/Metrics';
import {globalPadding, windowWidth} from '@src/app/styles/GlobalStyle';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {TextSection} from '@src/shared/ui/TextSection/TextSection';
import {
  descriptions1,
  descriptions2,
  descriptions3,
  descriptions4,
  descriptions5,
} from '../lib/howToUse';
import EntityInformationList from './EntityInformationList';
import OrderedList from './OrderedList';
import Images from './Images';
import {useTranslation} from 'react-i18next';

const HowToUsePage = () => {
  const {t} = useTranslation();
  return (
    <View style={styles.howToUse}>
      <Images />
      <View style={styles.content}>
        <View style={styles.item}>
          <TextSection paragraph={descriptions1} />
        </View>
        <View style={styles.item}>
          <EntityInformationList />
        </View>
        <View style={styles.item}>
          <TextSection
            title={t('how_to_use.title_challenges')}
            paragraph={descriptions2}
          />
        </View>
        <View style={styles.item}>
          <TextSection
            title={t('how_to_use.title_maintaining')}
            paragraph={descriptions3}
          />
        </View>
        <View style={styles.item}>
          <GradientText
            lineHeight={25}
            size={TextSize.SIZE_24}
            align="center"
            weight="700"
            text={`"${t('common.in_a_nutshell_fun')}"`}
          />
        </View>
        <View style={styles.item}>
          <TextSection
            title={t('common.you_can_do_more')}
            paragraph={descriptions4}
          />
        </View>
        <View style={styles.item}>
          <OrderedList />
        </View>
        <View style={styles.item}>
          <TextSection paragraph={descriptions5} />
        </View>
      </View>
    </View>
  );
};

export default memo(HowToUsePage);

const top = -120;

const styles = StyleSheet.create({
  howToUse: {
    flex: 1,
    marginBottom: top,
  },
  image: {
    height: verticalScale(400),
    width: windowWidth,
    left: -globalPadding,
  },
  content: {
    top,
  },
  descriptionWrapper: {
    marginBottom: verticalScale(30),
  },
  item: {
    marginBottom: verticalScale(40),
  },
});
