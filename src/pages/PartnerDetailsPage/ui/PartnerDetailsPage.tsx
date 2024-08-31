import React, {memo, useEffect, useState} from 'react';
import {Platform, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SvgXml} from 'react-native-svg';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {LinkedinIcon} from '@src/shared/assets/icons/Linkedin';
import {RouteProp, useRoute} from '@react-navigation/native';
import therapistsStore from '@src/pages/PartnersPage/model/therapistsStore';
import {CustomHeader} from '@src/widgets/headers/CustomHeader';
import {useTheme} from '@src/app/providers/themeProvider';
import {globalPadding} from '@src/app/styles/GlobalStyle';
import {
  HEADER_HEIGHT_ADNDROID,
  HEADER_HEIGHT_IOS,
} from '@src/shared/consts/common';
import firebaseStorage from '@react-native-firebase/storage';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {RichAppText} from '@src/shared/ui/AppText/RichAppText';
import {t} from 'i18next';
import {ProgramItem} from '@src/entities/ProgramItem';

const PartnerDetailsPage = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const {params} = useRoute<RouteProp<{params: {id: string}}>>();
  const colors = useColors();
  const {isDark} = useTheme();
  const lang = useLanguage();
  const therapist = therapistsStore.therapists.find(el => el.id === params.id);

  console.log(therapist);

  useEffect(() => {
    if (therapist) {
      const asyncEffect = async () => {
        const url = await firebaseStorage()
          .ref(`therapists_data/${therapist.image_name}`)
          .getDownloadURL();
        setAvatarUrl(url);
      };
      asyncEffect();
    }
  }, [therapist, therapist?.image_name]);

  return (
    <View style={styles.partners}>
      <CustomHeader
        transparent
        arrowColor={isDark ? colors.white : '#2E3440'}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {therapist && (
          <>
            <View style={styles.imageWrapper}>
              <FastImage
                source={{
                  uri: avatarUrl,
                }}
                style={[
                  styles.image,
                  {backgroundColor: colors.secondaryTextColor},
                ]}
              />
            </View>
            <View style={styles.nameWrapper}>
              <AppText
                align="justify"
                style={[styles.name, {color: colors.primaryTextColor}]}
                size={TextSize.LEVEL_7}
                text={therapist.full_name}
              />
              <SvgXml xml={LinkedinIcon} style={styles.icon} />
            </View>
            <RichAppText
              align={'justify'}
              style={styles.headline}
              size={TextSize.LEVEL_4}
              text={therapist.description[lang]}
            />
            {therapist.paragraphs[lang].map((paragraph, index) => (
              <RichAppText
                key={index}
                align={'justify'}
                style={[styles.description, {color: colors.primaryTextColor}]}
                size={TextSize.LEVEL_4}
                text={paragraph}
              />
            ))}

            {therapist.programs[lang].length > 0 && (
              <>
                <AppText
                  align={'justify'}
                  weight={'700'}
                  style={[styles.description, {color: colors.primaryTextColor}]}
                  size={TextSize.LEVEL_4}
                  text={`${t('therapists.programs_offered_by')} ${
                    therapist.first_name
                  }`}
                />
                <View style={styles.programs}>
                  {therapist.programs[lang].map((program, index) => (
                    <ProgramItem
                      key={therapist.id}
                      text={program.description}
                      isOdd={index % 2 === 0}
                    />
                  ))}
                </View>
              </>
            )}
            <View style={styles.bottomFiller} />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export const Wrapper = memo(PartnerDetailsPage);

const styles = StyleSheet.create({
  partners: {
    flex: 1,
    paddingHorizontal: globalPadding,
  },
  programs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  container: {
    paddingVertical:
      Platform.OS === 'ios'
        ? HEADER_HEIGHT_IOS
        : HEADER_HEIGHT_ADNDROID + (StatusBar.currentHeight as number),
  },
  bottomFiller: {
    height:
      Platform.OS === 'ios'
        ? HEADER_HEIGHT_IOS
        : HEADER_HEIGHT_ADNDROID + (StatusBar.currentHeight as number),
  },
  headline: {
    marginBottom: verticalScale(20),
  },
});
