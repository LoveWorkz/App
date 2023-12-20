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

const PartnersPage = () => {
  const colors = useColors();

  const listItems = [
    '1 to 1 therapy in person and online.',
    '‘Seven Principles for Making Marriage Work’ couples group course in person and online.',
    '‘Seven Principles for Singles’ singles group course, in person and online. ',
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
          text={'Arran Kennedy'}
        />
        <SvgXml xml={LinkedinIcon} style={styles.icon} />
      </View>
      <AppText
        align={'justify'}
        style={[styles.description, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={
          'Arran Kennedy works as a Psychologist, Cognitive Behavioural Psychotherapist and Couples Therapist. '
        }
      />
      <AppText
        align={'justify'}
        style={[styles.description, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={
          'For 10 years he has worked with adults, teens, children, and couples assisting people to navigate mind, mood, life and relationship challenges both in private practice and large company wellbeing programs. '
        }
      />
      <AppText
        align={'justify'}
        style={[styles.description, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={
          'Presently, he serves as a senior psychotherapist for staff at the Google EMEA Office Dublin.'
        }
      />
      <AppText
        align={'justify'}
        style={[styles.description, {color: colors.primaryTextColor}]}
        size={TextSize.LEVEL_4}
        text={
          'He is a Founder Member of the Irish Positive Psychology Association and has a special interest assisting couples to develop the knowledge, attitudes and skills to create thriving relationships and families.'
        }
      />

      <List title={'Programs offered by Arran: '} items={listItems} />
    </View>
  );
};

export const Wrapper = memo(PartnersPage);

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
