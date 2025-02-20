import React, {memo} from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {RouteProp, useRoute} from '@react-navigation/native';
import therapistsStore from '@src/pages/PartnersPage/model/therapistsStore';
import {CustomHeader} from '@src/widgets/headers/CustomHeader';
import {useTheme} from '@src/app/providers/themeProvider';
import {globalPadding} from '@src/app/styles/GlobalStyle';
import {
  HEADER_HEIGHT_ADNDROID,
  HEADER_HEIGHT_IOS,
} from '@src/shared/consts/common';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {RichAppText} from '@src/shared/ui/AppText/RichAppText';
import {ProgramItem} from '@src/entities/ProgramItem';
import {useTranslation} from 'react-i18next';
import {CleanRootStackParamList} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import ContactIcon from './ContactIcon';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {openBrowser} from '@swan-io/react-native-browser';
import {Badge} from '@src/widgets/Badge';

const PartnerDetailsPage = () => {
  const {params} = useRoute<
    //@ts-ignore
    RouteProp<CleanRootStackParamList, AppRouteNames.PARTNER_DETAILS>
  >();
  const colors = useColors();
  const {isDark} = useTheme();
  const lang = useLanguage();
  const {t} = useTranslation();
  const therapist = therapistsStore.therapists.find(el => el.id === params?.id);

  return (
    <View style={styles.partners}>
      <CustomHeader arrowColor={isDark ? colors.white : '#2E3440'} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {therapist && (
          <>
            <View style={styles.imageWrapper}>
              <FastImage
                source={{
                  uri: params?.avatarUri,
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
            </View>
            <View style={styles.languages}>
              {therapist.languages.map((language, index) => (
                <Badge key={index} text={t(`languages.${language}`)} />
              ))}
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
                style={[styles.paragraph, {color: colors.primaryTextColor}]}
                size={TextSize.LEVEL_4}
                text={paragraph}
              />
            ))}

            {therapist.programs[lang].length > 0 && (
              <>
                <AppText
                  align={'justify'}
                  weight={'700'}
                  style={[styles.paragraph, {color: colors.primaryTextColor}]}
                  size={TextSize.LEVEL_4}
                  text={`${t('therapists.programs_offered_by')} ${
                    therapist.first_name
                  }`}
                />
                <View style={styles.programs}>
                  {therapist.programs[lang].map((program, index) => (
                    <ProgramItem
                      key={program.id}
                      text={program.description}
                      isOdd={index % 2 === 0}
                    />
                  ))}
                </View>
              </>
            )}

            {therapist.contacts.length > 0 && (
              <>
                <AppText
                  align={'justify'}
                  weight={'700'}
                  style={[styles.description, {color: colors.primaryTextColor}]}
                  size={TextSize.LEVEL_4}
                  text={t('therapists.contacts')}
                />
                <View
                  style={[
                    styles.contacts,
                    {
                      backgroundColor: isDark
                        ? colors.bgTertiaryColor
                        : colors.white,
                    },
                  ]}>
                  <>
                    {therapist.contacts.map((contact, index) => (
                      <View key={index} style={styles.contactBox}>
                        <View style={styles.iconContainer}>
                          <ContactIcon
                            style={styles.socialIcon}
                            iconName={contact.type}
                          />
                          <AppText
                            align={'justify'}
                            style={[
                              styles.contactType,
                              {color: colors.primaryTextColor},
                            ]}
                            size={TextSize.LEVEL_4}
                            text={t(`therapist.contact_${contact.type}`)}
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            if (
                              contact.type === 'phone' ||
                              contact.type === 'email'
                            ) {
                              Linking.openURL(contact.uri);
                            } else {
                              openBrowser(contact.uri, {});
                            }
                          }}>
                          <AppText
                            align={'justify'}
                            weight="700"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[
                              styles.link,
                              {color: colors.primaryTextColor},
                            ]}
                            size={TextSize.LEVEL_4}
                            text={contact.value}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </>
                </View>
              </>
            )}
          </>
        )}
        <View style={styles.bottomFiller} />
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
    marginBottom: 12,
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
  description: {},
  link: {
    textDecorationLine: 'underline',
    flexShrink: 1,
  },
  icon: {
    top: 2,
  },
  container: {},
  bottomFiller: {
    height:
      Platform.OS === 'ios'
        ? HEADER_HEIGHT_IOS
        : HEADER_HEIGHT_ADNDROID + (StatusBar.currentHeight as number),
  },
  headline: {
    marginBottom: verticalScale(20),
  },
  contacts: {
    marginBottom: 100,
    borderRadius: 12,
    paddingTop: 0,
    paddingBottom: 24,
    padding: 24,
    marginTop: 24,
  },
  contactBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  paragraph: {
    marginBottom: 24,
  },
  socialIcon: {
    marginRight: 12,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  contactType: {
    marginRight: 12,
  },
  languages: {
    flexDirection: 'row',
    marginBottom: 32,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});
