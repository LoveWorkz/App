import React, {memo, useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useColors} from '@src/app/providers/colorsProvider';
import {AppText, TextSize} from '@src/shared/ui/AppText/AppText';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@src/shared/lib/Metrics';
import {getShadowOpacity} from '@src/app/styles/GlobalStyle';
import {navigation} from '@src/shared/lib/navigation/navigation';
import {AppRouteNames} from '@src/shared/config/route/configRoute';
import {cutText} from '@src/shared/lib/common';
import CustomCheckBox from '@src/shared/ui/CustomCheckBox/CustomCheckBox';
import {isPlatformIos} from '@src/shared/consts/common';
import {LanguageValueType} from '@src/widgets/LanguageSwitcher';
import Skeleton from '@src/shared/ui/Skeleton/Skeleton';
import {useTheme} from '@src/app/providers/themeProvider';
import {ChallengeType} from '../../model/types/ChallengeTypes';
import challengeStore from '../../model/store/challengeStore';
import RoundChallenge from '../RoundChallenge/RoundChallenge';

interface ChallengeItemProps {
  challenge: ChallengeType;
  isLoading: boolean;
}

const borderRadius = moderateScale(20);

export const ChallengeItem = (props: ChallengeItemProps) => {
  const {challenge, isLoading} = props;
  const {title, description, isChecked, nomer, id} = challenge;
  const colors = useColors();
  const {i18n} = useTranslation();
  const {theme} = useTheme();

  const StandardTextLength = 50;
  const language = i18n.language as LanguageValueType;
  const ISDescriptionLarge = description[language].length > StandardTextLength;

  const onChangeHandler = useCallback(() => {
    challengeStore.selectChallenge({id});
  }, [id]);

  if (isLoading) {
    return <Skeleton width={'100%'} height={120} borderRadius={borderRadius} />;
  }

  const onChallengePressHandler = () => {
    challengeStore.setCoreChallenge(challenge);

    navigation.navigate(AppRouteNames.CORE_CHALLENGE_CARDS, {
      title: title[language],
    });
  };

  return (
    <TouchableOpacity onPress={onChallengePressHandler}>
      <View
        style={[
          challengeStyles.ChallengeItem,
          {
            backgroundColor: colors.bgSecondaryColor,
            ...getShadowOpacity(theme).shadowOpacity_level_1,
          },
        ]}>
        <View style={challengeStyles.nomerWrapper}>
          <RoundChallenge number={nomer} isActive={isChecked} />
        </View>
        <View style={challengeStyles.textWrapper}>
          <AppText
            style={challengeStyles.title}
            weight={'500'}
            size={TextSize.LEVEL_4}
            text={title[language]}
          />

          <Text>
            <AppText
              style={[{color: colors.challengeCategoryNameColor}]}
              size={TextSize.LEVEL_4}
              text={
                ISDescriptionLarge
                  ? cutText({
                      text: description[language],
                      textSize: StandardTextLength,
                    })
                  : description[language]
              }
              weight={isPlatformIos ? '400' : '100'}
            />
          </Text>
        </View>
        <View>
          <CustomCheckBox checked={isChecked} onChange={onChangeHandler} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ChallengeItem);

export const challengeStyles = StyleSheet.create({
  ChallengeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(10),
    borderRadius: borderRadius,
  },
  nomerWrapper: {
    alignItems: 'center',
    width: 'auto',
  },
  textWrapper: {
    width: horizontalScale(191),
  },
  title: {
    marginBottom: horizontalScale(10),
  },
  checkbox: {
    padding: moderateScale(5),
    height: horizontalScale(30),
  },
});
