import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {WhiteHeartsIcon} from '@src/shared/assets/icons/Hearts';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {useTheme} from '@src/app/providers/themeProvider';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';

interface ChallengeGroupProps {
  title: string;
  description: string;
}

const ChallengeGroupDetails = (props: ChallengeGroupProps) => {
  const {title, description} = props;
  const {t} = useTranslation();

  const colors = useColors();
  const {isDark} = useTheme();

  return (
    <View
      style={[
        styles.ChallengeGroup,
        {backgroundColor: colors.themeSecondaryBackground},
      ]}>
      <AppText
        style={{color: colors.white}}
        weight="700"
        text={title}
        size={TextSize.LEVEL_7}
      />
      <SvgXml xml={WhiteHeartsIcon} style={styles.icon} />
      <View style={[styles.descriptionWrapper, {borderColor: colors.white}]}>
        <AppText
          size={TextSize.LEVEL_5}
          style={[styles.title, {color: colors.white}]}
          weight={'700'}
          text={t('challenge.group_info_title')}
        />
        <AppText
          size={TextSize.LEVEL_4}
          style={{color: colors.white}}
          text={description}
        />
        <AppText
          size={TextSize.LEVEL_5}
          style={[styles.title2, {color: colors.white}]}
          weight={'700'}
          text={t('challenge.group_instructions_title')}
        />
      </View>
      <Button
        backgroundColor={colors.white}
        theme={isDark ? ButtonTheme.GRADIENT : ButtonTheme.NORMAL}
        style={[styles.btn, isDark ? {} : {backgroundColor: colors.white}]}>
        {isDark ? (
          <AppText
            style={{color: colors.primaryTextColor}}
            weight={'600'}
            size={TextSize.LEVEL_4}
            text={t('challenge.hop_to_the_challenges')}
          />
        ) : (
          <GradientText
            size={TextSize.LEVEL_4}
            weight={'500'}
            text={t('challenge.hop_to_the_challenges')}
          />
        )}
      </Button>
    </View>
  );
};

export default memo(ChallengeGroupDetails);

const marginBottom = verticalScale(20);

const styles = StyleSheet.create({
  ChallengeGroup: {
    flex: 1,
    alignItems: 'center',
    paddingTop: verticalScale(10),
  },
  icon: {
    width: horizontalScale(60),
    height: horizontalScale(70),
    marginBottom: verticalScale(20),
    marginTop: verticalScale(5),
  },
  descriptionWrapper: {
    width: '100%',
    height: verticalScale(470),
    borderWidth: 1,
    borderRadius: moderateScale(20),
    padding: horizontalScale(20),
  },
  title: {
    marginBottom,
  },
  title2: {
    marginTop: verticalScale(20),
    marginBottom,
  },
  btn: {
    marginTop: verticalScale(20),
    width: '100%',
  },
});
