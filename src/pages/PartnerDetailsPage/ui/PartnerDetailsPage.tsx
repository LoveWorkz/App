import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SvgXml} from 'react-native-svg';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {List} from '@src/shared/ui/List';
import {LinkedinIcon} from '@src/shared/assets/icons/Linkedin';
import {useTranslation} from 'react-i18next';

const PartnerDetailsPage = () => {
  const colors = useColors();
  const {t} = useTranslation();

  const listItems = [
    t('common.partners_item_1'),
    t('common.partners_item_2'),
    t('common.partners_item_3'),
  ];

  return (
    <View style={styles.partners}>
      <View style={styles.imageWrapper}>
        <FastImage
          style={[styles.image, {backgroundColor: colors.secondaryTextColor}]}
        />
      </View>
      <View style={styles.nameWrapper}>
        <AppText
          style={[styles.name, {color: colors.primaryTextColor}]}
          size={TextSize.LEVEL_7}
          text={t('common.arran_kennedy')}
        />
        <SvgXml xml={LinkedinIcon} style={styles.icon} />
      </View>
      <AppText
        align={'justify'}
        style={[styles.description, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={t('common.arran_text_1')}
      />
      <AppText
        align={'justify'}
        style={[styles.description, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={t('common.arran_text_2')}
      />
      <AppText
        align={'justify'}
        style={[styles.description, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={t('common.arran_text_3')}
      />
      <AppText
        align={'justify'}
        style={[styles.description, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={t('common.arran_text_4')}
      />

      <List title={t('common.programs_offered_by_arran')} items={listItems} />
    </View>
  );
};

export const Wrapper = memo(PartnerDetailsPage);

const styles = StyleSheet.create({
  partners: {
    flex: 1,
  },
  imageWrapper: {
    alignItems: 'center',
  },
  image: {
    marginBottom: 30,
    width: horizontalScale(200),
    height: horizontalScale(200),
    borderRadius: moderateScale(100),
    textAlign: 'center',
  },
  nameWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  name: {
    marginBottom: verticalScale(25),
    marginRight: horizontalScale(10),
  },
  description: {
    marginBottom: verticalScale(20),
  },
  icon: {
    top: 2,
  },
});
