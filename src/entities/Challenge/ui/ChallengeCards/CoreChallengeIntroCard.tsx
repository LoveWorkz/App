import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';

import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {useColors} from '@src/app/providers/colorsProvider';
import {challengeIntroCard} from '@src/shared/assets/images';
import {horizontalScale, verticalScale} from '@src/shared/lib/Metrics';
import {Button, ButtonTheme} from '@src/shared/ui/Button/Button';
import {GradientText} from '@src/shared/ui/GradientText/GradientText';
import {StyledWordText} from '@src/shared/ui/StyledWordText/StyledWordText';
import {globalStyles} from '@src/app/styles/GlobalStyle';
import {StyleType} from '@src/shared/types/types';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {challengeGroupStore} from '@src/entities/ChallengeGroup';
import {useLanguage} from '@src/shared/lib/hooks/useLanguage';
import {useTranslation} from 'react-i18next';

const CoreChallengeIntroCard = () => {
  const colors = useColors();
  const language = useLanguage();
  const {t} = useTranslation();

  const textStyle = useMemo(() => {
    return {color: colors.white};
  }, [colors.white]);

  const currentCoreChallengeGroup =
    challengeGroupStore.currentCoreChallengeGroup;

  if (!currentCoreChallengeGroup) {
    return null;
  }

  const groupName = currentCoreChallengeGroup.displayName[language];
  const description = currentCoreChallengeGroup.largeDescription?.[language];
  const groupTitle = currentCoreChallengeGroup.title?.[language];

  const LetsDoItPressHandler = () => {
    navigation.navigate(AppRouteNames.CORE_CHALLENGE_CARDS, {
      title: groupName,
    });
  };

  return (
    <View style={styles.ChallengeIntroCard}>
      {groupTitle && (
        <View style={styles.topPart}>
          <AppText
            style={textStyle}
            size={TextSize.SIZE_24}
            lineHeight={30}
            weight={'700'}
            text={groupTitle}
          />
        </View>
      )}

      <FastImage
        resizeMode="stretch"
        source={challengeIntroCard as number} // image number
        style={styles.cardBg}>
        <View style={styles.cardItem}>
          <View style={styles.title}>
            <AppText
              style={textStyle}
              size={TextSize.LEVEL_5}
              lineHeight={24}
              weight="700"
              text={t('challenge.group_info_title')}
            />
          </View>
          {description && (
            <AppText
              style={textStyle}
              size={TextSize.LEVEL_4}
              lineHeight={20}
              text={description}
            />
          )}
        </View>
        <View style={styles.title}>
          <AppText
            style={textStyle}
            size={TextSize.LEVEL_5}
            lineHeight={24}
            weight="700"
            text={t('challenge.group_instructions_title')}
          />
        </View>

        <StyledWordText
          styledWords={['one']}
          styledWordStyle={[styles.styledWordStyle, textStyle]}
          textStyle={[styles.textStyle, textStyle]}
          text={`${t(
            'common.choose_of_the_following',
          )} ${groupName.toLowerCase()}, ${t(
            'common.choose_of_the_following_part_2',
          )}`}
        />
      </FastImage>

      <Button
        onPress={LetsDoItPressHandler}
        theme={ButtonTheme.NORMAL}
        style={[styles.btn, {backgroundColor: colors.white}]}>
        <GradientText
          size={TextSize.LEVEL_4}
          weight={'600'}
          text={t('challenge.hop_to_the_challenge')}
        />
      </Button>
    </View>
  );
};

export default memo(observer(CoreChallengeIntroCard));

const width = '90%';
const styledWordStyle: StyleType = {
  ...globalStyles.size_4,
  lineHeight: 20,
};

const styles = StyleSheet.create({
  ChallengeIntroCard: {
    flex: 1,
    alignItems: 'center',
  },
  topPart: {
    marginBottom: verticalScale(30),
    alignItems: 'center',
  },
  title: {
    marginBottom: verticalScale(20),
  },
  cardItem: {
    marginBottom: verticalScale(30),
  },
  cardBg: {
    width: width,
    padding: horizontalScale(20),
  },
  btn: {
    position: 'absolute',
    bottom: verticalScale(20),
    width: width,
  },

  styledWordStyle: {
    ...styledWordStyle,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  textStyle: {
    ...styledWordStyle,
  },
});
